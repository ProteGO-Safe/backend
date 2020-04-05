import logging
import secrets
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import Optional

import pytz
from flask import jsonify
from google.cloud import datastore
from google.cloud.datastore import Entity

from utils import (
    validate_request_parameters,
    get_request_data,
    ExtraParam,
    InvalidRequestException,
    REGISTRATION_STATUS_COMPLETED,
    REGISTRATION_STATUS_INCORRECT,
    create_user,
    DATASTORE_KIND_REGISTRATIONS,
    DATASTORE_KIND_USERS,
)

CONFIRMATIONS_PER_MSISDN_LIMIT = 3

KEY_CODE = "code"
KEY_REGISTRATION_ID = "registration_id"

datastore_client = datastore.Client()


def confirm_registration(request):
    try:
        request_data = get_request_data(request)
        validate_request_parameters(
            request_data, validate_standard_params=False, extra_params=[ExtraParam(KEY_CODE), ExtraParam(KEY_REGISTRATION_ID)]
        )
    except InvalidRequestException as e:
        return jsonify(e.response), e.status

    code = request_data[KEY_CODE]
    registration_id = request_data[KEY_REGISTRATION_ID]

    registration = _get_registration(registration_id)

    if (
        not registration
        or registration["status"] == REGISTRATION_STATUS_COMPLETED
        or _is_confirmation_limit_reached(registration["msisdn"])
    ):
        return jsonify({"status": "failed", "message": "Invalid data"}), HTTPStatus.UNPROCESSABLE_ENTITY

    if registration["date"] < datetime.now(tz=pytz.utc) - timedelta(minutes=10):
        return (
            jsonify({"status": "failed", "message": "Rejestracja wygasła. Spróbuj ponownie"}),
            HTTPStatus.UNPROCESSABLE_ENTITY,
        )

    if registration["code"] != code:
        _update_registration(registration, REGISTRATION_STATUS_INCORRECT)
        return jsonify({"status": "failed", "message": "Invalid data"}), HTTPStatus.UNPROCESSABLE_ENTITY

    _update_registration(registration, REGISTRATION_STATUS_COMPLETED)

    user = _find_user_by_msisdn(registration["msisdn"])

    if not user:
        user_id = secrets.token_hex(32)
        date = datetime.now(tz=pytz.utc)
        user = create_user(user_id, date, registration["msisdn"])

    return jsonify({"status": "ok", "user_id": user["user_id"]})


def _get_registration(registration_id: str) -> Optional[Entity]:
    key = datastore_client.key(DATASTORE_KIND_REGISTRATIONS, f"{registration_id}")
    return datastore_client.get(key=key)


def _update_registration(entity: Entity, status: str):
    entity.update({"status": status})
    datastore_client.put(entity)


def _find_user_by_msisdn(msisdn: str) -> Optional[str]:
    query = datastore_client.query(kind=DATASTORE_KIND_USERS)
    query.add_filter("msisdn", "=", msisdn)
    entities = list(query.fetch())
    if len(entities) > 0:
        return entities[0]

    return None


def _is_confirmation_limit_reached(msisdn: str) -> bool:
    start_date = datetime.now(tz=pytz.utc) - timedelta(hours=1)

    query = datastore_client.query(kind=DATASTORE_KIND_REGISTRATIONS)
    query.add_filter("msisdn", "=", msisdn)
    query.add_filter("date", ">", start_date)

    registration_entities = list(query.fetch())
    if len(registration_entities) >= CONFIRMATIONS_PER_MSISDN_LIMIT:
        logging.warning(f"_confirmation_limit_reached: msisdn: {msisdn}")
        return True

    return False
