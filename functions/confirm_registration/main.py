import json
import logging
import secrets
from datetime import datetime, timedelta
from typing import Optional

import pytz
from flask import jsonify, current_app
from google.cloud import datastore
from google.cloud.datastore import Entity

current_app.config['JSON_AS_ASCII'] = False
CONFIRMATIONS_PER_MSISDN_LIMIT = 3
REGISTRATION_STATUS_COMPLETED = "completed"
REGISTRATION_STATUS_INCORRECT = "incorrect"
DATA_STORE_REGISTRATION_KIND = "Registrations"
DATA_STORE_USERS_KIND = "Users"

LANG = None
MESSAGE_INVALID_DATA = 'invalid_data'
MESSAGE_REGISTRATION_EXPIRED = 'registration_expired'
with open("messages.json") as file:
    MESSAGES = json.load(file)

datastore_client = datastore.Client()


def confirm_registration(request):
    if request.method != "POST":
        return jsonify(
            {"status": "failed",
             "message": "Invalid method"
             }
        ), 405

    if not request.is_json \
            or "code" not in request.get_json() \
            or "registration_id" not in request.get_json():
        return jsonify(
            {"status": "failed",
             "message": "Invalid data"
             }
        ), 422
    request_data = request.get_json()

    if not _is_language_valid(request_data):
        return False, (jsonify(
            {
                "status": "failed",
                "message": "Set lang parameter to pl or en"
            }
        ), 422)

    _set_language(request_data['lang'])

    code = request_data["code"]
    registration_id = request_data["registration_id"]

    registration_entity = _get_registration_entity(registration_id)

    if not registration_entity \
            or registration_entity["status"] == REGISTRATION_STATUS_COMPLETED \
            or _confirmation_limit_reached(registration_entity["msisdn"]):
        return jsonify(
            {
                "status": "failed",
                "message": _get_message(MESSAGE_INVALID_DATA)
            }
        ), 422

    if registration_entity["date"] < datetime.now(tz=pytz.utc) - timedelta(minutes=10):
        return jsonify(
            {
                "status": "failed",
                "message":  _get_message(MESSAGE_REGISTRATION_EXPIRED)
            }
        ), 422

    if registration_entity["code"] != code:
        _update_registration(registration_entity, REGISTRATION_STATUS_INCORRECT)
        return jsonify(
            {"status": "failed",
             "message": _get_message(MESSAGE_INVALID_DATA)
             }
        ), 422

    _update_registration(registration_entity, REGISTRATION_STATUS_COMPLETED)

    user_id = _get_existing_user_id(registration_entity["msisdn"])

    if not user_id:
        user_id = secrets.token_hex(32)
        date = datetime.now(tz=pytz.utc)
        _create_user(registration_entity["msisdn"], user_id, date)

    return jsonify(
        {
            "status": "ok",
            "user_id": user_id,
        }
    )


def _is_language_valid(request_data: dict) -> bool:
    languages_available = ("pl", "en")
    lang = request_data.get("lang")
    if lang not in languages_available:
        logging.warning(f"Invalid lang: {lang}")
        return False
    return True


def _set_language(lang: str) -> None:
    global LANG
    LANG = lang


def _get_message(message_code: str) -> str:
    return MESSAGES[message_code][LANG]


def _get_registration_entity(registration_id: str) -> Optional[Entity]:
    kind = DATA_STORE_REGISTRATION_KIND
    key = datastore_client.key(kind, f"{registration_id}")
    return datastore_client.get(key=key)


def _update_registration(entity: Entity, status: str):
    entity.update({
        "status": status,
    })
    datastore_client.put(entity)


def _get_existing_user_id(msisdn: str) -> Optional[str]:
    query = datastore_client.query(kind=DATA_STORE_USERS_KIND)
    query.add_filter("msisdn", "=", msisdn)
    entities = list(query.fetch())
    if len(entities) > 0:
        return entities[0]["user_id"]

    return None


def _create_user(msisdn: str, user_id: str, date: datetime) -> None:
    key = datastore_client.key(DATA_STORE_USERS_KIND, f"{user_id}")

    user = datastore.Entity(key=key)
    user.update(
        {
            "user_id": user_id,
            "msisdn": msisdn,
            "created": date,
            "status": "orange",
        }
    )

    datastore_client.put(user)


def _confirmation_limit_reached(msisdn: str) -> bool:
    start_date = datetime.now(tz=pytz.utc) - timedelta(hours=1)

    query = datastore_client.query(kind=DATA_STORE_REGISTRATION_KIND)
    query.add_filter("msisdn", "=", msisdn)
    query.add_filter(
        "date", ">", start_date
    )

    registration_entities = list(query.fetch())
    if len(registration_entities) >= CONFIRMATIONS_PER_MSISDN_LIMIT:
        logging.warning(f"_confirmation_limit_reached: msisdn: {msisdn}")
        return True

    return False
