import json
import logging
import os
import random
import secrets
import string
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import Optional, List

import pytz
from flask import jsonify
from google.cloud import datastore
from google.cloud import pubsub_v1

from utils import (
    get_request_data,
    validate_request_parameters,
    InvalidRequestException,
    ExtraParam,
    DATASTORE_KIND_REGISTRATIONS,
    REGISTRATION_STATUS_PENDING,
    REGISTRATION_STATUS_INCORRECT,
)

PROJECT_ID = os.environ["GCP_PROJECT"]
PUBSUB_SEND_REGISTER_SMS_TOPIC = os.environ["PUBSUB_SEND_REGISTER_SMS_TOPIC"]
STAGE = os.environ["STAGE"]

KEY_MSISDN = "msisdn"

INVALID_REGS_PER_IP_LIMIT = 10
INVALID_REGS_PER_MSISDN_LIMIT = 4
CODE_CHARACTERS = string.digits

datastore_client = datastore.Client()
publisher = pubsub_v1.PublisherClient()


def register(request):
    try:
        request_data = get_request_data(request)
        validate_request_parameters(request_data, validate_standard_params=False, extra_params=[ExtraParam(KEY_MSISDN)])
    except InvalidRequestException as e:
        return jsonify(e.response), e.status

    msisdn = request_data[KEY_MSISDN]
    ip = request.headers.get("X-Forwarded-For")

    if not _check_phone_number(msisdn):
        return jsonify({"status": "failed", "message": "Invalid phone number"}), HTTPStatus.UNPROCESSABLE_ENTITY

    if _is_too_many_requests_for("ip", ip, limit=INVALID_REGS_PER_IP_LIMIT) or _is_too_many_requests_for(
        "msisdn", msisdn, limit=INVALID_REGS_PER_MSISDN_LIMIT
    ):
        return (
            jsonify({"status": "failed", "message": "Registration temporarily not available. Try again in an hour"}),
            HTTPStatus.TOO_MANY_REQUESTS,
        )

    code = _get_pending_registration_code(msisdn) or "".join(random.choice(CODE_CHARACTERS) for _ in range(6))
    registration_id = secrets.token_hex(32)
    date = datetime.now(tz=pytz.utc)

    _save_registration_to_datastore(code, msisdn, date, registration_id, ip)

    response = {"status": "ok", "registration_id": registration_id}

    send_sms = request_data.get("send_sms", True)
    if STAGE == "DEVELOPMENT" and not send_sms:
        response["code"] = code
    else:
        _publish_to_send_register_sms_topic(msisdn, registration_id, code)

    return jsonify(response)


def _check_phone_number(msisdn: str):
    msisdn = msisdn.strip().replace(" ", "")
    if not msisdn.startswith("+48"):
        logging.warning(f"check_phone_number: invalid prefix: {msisdn}")
        return False
    if len(msisdn) != 12:
        logging.warning(f"check_phone_number: invalid msisdn length: {msisdn}")
        return False

    try:
        int(msisdn)
    except ValueError:
        logging.warning(f"check_phone_number: invalid value: {msisdn}")
        return False

    return True


def _is_too_many_requests_for(field: str, value: str, limit: int) -> bool:
    registration_entities = _get_registration_entities(field, value, timedelta(hours=1), status=REGISTRATION_STATUS_PENDING)
    registration_entities += _get_registration_entities(field, value, timedelta(hours=1), status=REGISTRATION_STATUS_INCORRECT)

    if len(registration_entities) >= limit:
        logging.warning(f"_is_too_many_requests_for: {field}: {value}")
        return True

    return False


def _get_pending_registration_code(msisdn: str) -> Optional[str]:
    registration_entities = _get_registration_entities(
        "msisdn", msisdn, timedelta(minutes=10), status=REGISTRATION_STATUS_PENDING
    )

    if len(registration_entities) > 0:
        logging.info("_get_pending_registration_code: returning existing code")
        return registration_entities[0]["code"]

    return None


def _should_send_sms(msisdn: str) -> bool:
    registration_entities = _get_registration_entities("msisdn", msisdn, timedelta(minutes=1))

    if len(registration_entities) > 0:
        logging.warning(f"_should_send_sms: resend sms request for msisdn: {msisdn}")
        return False

    return True


def _get_registration_entities(
    field: str, value: str, time_period: timedelta, status: Optional[str] = None
) -> List[datastore.Entity]:
    query = datastore_client.query(kind=DATASTORE_KIND_REGISTRATIONS)
    query.add_filter(field, "=", value)
    if status:
        query.add_filter("status", "=", status)
    start_date = datetime.now(tz=pytz.utc) - time_period
    query.add_filter("date", ">", start_date)
    return list(query.fetch())


def _save_registration_to_datastore(code: str, msisdn: str, date: datetime, registration_id: str, ip: str):
    key = datastore_client.key(DATASTORE_KIND_REGISTRATIONS, f"{registration_id}")

    registration = datastore.Entity(key=key)
    registration.update(
        {
            "code": code,
            "msisdn": msisdn,
            "date": date,
            "registration_id": registration_id,
            "sms_send": False,
            "ip": ip,
            "status": REGISTRATION_STATUS_PENDING,
        }
    )

    datastore_client.put(registration)


def _publish_to_send_register_sms_topic(msisdn: str, registration_id: str, code: str):
    topic_path = publisher.topic_path(PROJECT_ID, PUBSUB_SEND_REGISTER_SMS_TOPIC)
    data = {"registration_id": registration_id, "msisdn": msisdn, "code": code}
    publisher.publish(topic_path, json.dumps(data).encode("utf-8"))
