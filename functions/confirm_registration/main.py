import logging
import secrets
from datetime import datetime, timedelta
from typing import Optional

import pytz
from flask import jsonify, current_app
from google.cloud.datastore import Entity

from commons.datastore import (
    get_entity_by_key,
    REGISTRATIONS,
    update_entity,
    USERS,
    find_entities_by_filter,
    QueryFilter,
    create_entity,
)
from commons.messages import get_message, MESSAGE_INVALID_DATA, MESSAGE_REGISTRATION_EXPIRED
from commons.rate_limit import limit_requests

current_app.config["JSON_AS_ASCII"] = False
CONFIRMATIONS_PER_MSISDN_LIMIT = 3
REGISTRATION_STATUS_COMPLETED = "completed"
REGISTRATION_STATUS_INCORRECT = "incorrect"


@limit_requests()
def confirm_registration(request):
    if request.method != "POST":
        return jsonify({"status": "failed", "message": "Invalid method"}), 405

    if not request.is_json or "code" not in request.get_json() or "registration_id" not in request.get_json():
        return jsonify({"status": "failed", "message": "Invalid data"}), 422
    request_data = request.get_json()

    if not _is_language_valid(request_data):
        return jsonify({"status": "failed", "message": "Set lang parameter to pl or en"}), 422

    lang = request_data["lang"]
    code = request_data["code"]
    registration_id = request_data["registration_id"]

    registration_entity = _get_registration_entity(registration_id)

    if (
        not registration_entity
        or registration_entity["status"] == REGISTRATION_STATUS_COMPLETED
        or _confirmation_limit_reached(registration_entity["msisdn"])
    ):
        return jsonify({"status": "failed", "message": get_message(MESSAGE_INVALID_DATA, lang)}), 422

    if registration_entity["date"] < datetime.now(tz=pytz.utc) - timedelta(minutes=10):
        return jsonify({"status": "failed", "message": get_message(MESSAGE_REGISTRATION_EXPIRED, lang)}), 422

    if registration_entity["code"] != code:
        _update_registration(registration_entity, REGISTRATION_STATUS_INCORRECT)
        return jsonify({"status": "failed", "message": get_message(MESSAGE_INVALID_DATA, lang)}), 422

    _update_registration(registration_entity, REGISTRATION_STATUS_COMPLETED)

    user_id = _get_existing_user_id(registration_entity["msisdn"])

    if not user_id:
        user_id = secrets.token_hex(32)
        date = datetime.now(tz=pytz.utc)
        _create_user(registration_entity["msisdn"], user_id, date)

    return jsonify({"status": "ok", "user_id": user_id})


def _is_language_valid(request_data: dict) -> bool:
    languages_available = ("pl", "en")
    lang = request_data.get("lang")
    if lang not in languages_available:
        logging.warning(f"Invalid lang: {lang}")
        return False
    return True


def _get_registration_entity(registration_id: str) -> Optional[Entity]:
    return get_entity_by_key(REGISTRATIONS, registration_id)


def _update_registration(entity: Entity, status: str):
    update_entity(entity, {"status": status})


def _get_existing_user_id(msisdn: str) -> Optional[str]:
    entities = find_entities_by_filter(USERS, [QueryFilter("msisdn", "=", msisdn)])
    if len(entities) > 0:
        return entities[0]["user_id"]

    return None


def _create_user(msisdn: str, user_id: str, date: datetime) -> None:
    create_entity(USERS, user_id, {"user_id": user_id, "msisdn": msisdn, "created": date, "status": "orange"})


def _confirmation_limit_reached(msisdn: str) -> bool:
    start_date = datetime.now(tz=pytz.utc) - timedelta(hours=1)

    registration_entities = find_entities_by_filter(
        REGISTRATIONS, [QueryFilter("msisdn", "=", msisdn), QueryFilter("date", ">", start_date)]
    )
    if len(registration_entities) >= CONFIRMATIONS_PER_MSISDN_LIMIT:
        logging.warning(f"_confirmation_limit_reached: msisdn: {msisdn}")
        return True

    return False
