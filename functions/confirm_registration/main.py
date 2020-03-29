from typing import Optional
import uuid

from flask import jsonify
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
            or "msisdn" not in request.get_json() \
            or "code" not in request.get_json() \
            or "registration_id" not in request.get_json():
        return jsonify(
            {"status": "failed",
             "message": "invalid data"
             }
        ), 422
    request_data = request.get_json()

    msisdn = request_data["msisdn"]
    code = request_data["code"]
    registration_id = request_data["registration_id"]

    entity = _get_from_datastore(msisdn)

    if not entity or entity["code"] != code or entity["registration_id"] != registration_id:
        return jsonify(
            {"status": "failed",
             "message": "invalid data"
             }
        ), 422

    user_id = str(uuid.uuid4())

    _update_entity(entity, user_id)

    return jsonify(
        {
            "status": "ok",
            "user_id": user_id,
        }
    )


def _get_from_datastore(msisdn: str) -> Optional[Entity]:
    kind = "Device"
    device_key = datastore_client.key(kind, f"{msisdn}")
    return datastore_client.get(key=device_key)


def _update_entity(entity: Entity, user_id, confirmed=True) -> None:
    entity.update(
        {
            "user_id": user_id,
            "confirmed": confirmed,
        }
    )

    datastore_client.put(entity)
