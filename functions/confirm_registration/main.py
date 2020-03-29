import secrets
from typing import Optional

import pytz
from flask import jsonify
from datetime import datetime
from google.cloud import datastore
from google.cloud.datastore import Entity

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
             "message": "invalid data"
             }
        ), 422
    request_data = request.get_json()

    code = request_data["code"]
    registration_id = request_data["registration_id"]

    registration_entity = _get_registration_entity(registration_id)

    if not registration_entity \
            or registration_entity["code"] != code \
            or registration_entity["registration_id"] != registration_id:
        return jsonify(
            {"status": "failed",
             "message": "invalid data"
             }
        ), 422

    user_id = secrets.token_hex(16)
    date = datetime.now(tz=pytz.utc)

    _update_registration(registration_entity)
    _create_user(registration_entity["msisdn"], user_id, date)

    return jsonify(
        {
            "status": "ok",
            "user_id": user_id,
        }
    )


def _get_registration_entity(registration_id: str) -> Optional[Entity]:
    kind = "Registrations"
    key = datastore_client.key(kind, f"{registration_id}")
    return datastore_client.get(key=key)


def _update_registration(entity: Entity):
    entity.update({
        "confirmed": True,
    })
    datastore_client.put(entity)


def _create_user(msisdn, user_id, date) -> None:
    kind = "Users"
    key = datastore_client.key(kind, f"{user_id}")

    registration = datastore.Entity(key=key)
    registration.update(
        {
            'user_id': user_id,
            'msisdn': msisdn,
            'created': date,
        }
    )

    datastore_client.put(registration)
