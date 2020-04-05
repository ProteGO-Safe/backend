from datetime import datetime
from http import HTTPStatus
from typing import List, Optional

from flask import Request
from google.cloud import datastore
from google.cloud.datastore import Entity

DATASTORE_KIND_USERS = "Users"
DATASTORE_KIND_REGISTRATIONS = "Registrations"
DATASTORE_KIND_ENCOUNTER_UPLOADS = "Encounter Uploads"

REGISTRATION_STATUS_COMPLETED = "completed"
REGISTRATION_STATUS_INCORRECT = "incorrect"
REGISTRATION_STATUS_PENDING = "pending"

KEY_USER_ID = "user_id"
KEY_PLATFORM = "platform"
KEY_OS_VERSION = "os_version"
KEY_DEVICE_TYPE = "device_type"
KEY_APP_VERSION = "app_version"
KEY_LANG = "lang"

datastore_client = datastore.Client()


class InvalidRequestException(Exception):
    def __init__(self, status, response):
        self.status = status
        self.response = response


class ExtraParam:
    def __init__(self, name, allow_empty=False):
        self.name = name
        self.allow_empty = allow_empty


def get_request_data(request: Request) -> dict:
    if request.method != "POST":
        raise InvalidRequestException(HTTPStatus.METHOD_NOT_ALLOWED, {"status": "failed", "message": "invalid data"})

    if not request.is_json:
        raise InvalidRequestException(HTTPStatus.UNPROCESSABLE_ENTITY, {"status": "failed", "message": "invalid data"})

    return request.get_json()


def validate_request_parameters(
    request_data: dict, validate_standard_params=True, extra_params: List[ExtraParam] = None
) -> None:
    if validate_standard_params:
        for key in [KEY_USER_ID, KEY_PLATFORM, KEY_OS_VERSION, KEY_DEVICE_TYPE, KEY_APP_VERSION, KEY_LANG]:
            if key not in request_data:
                raise InvalidRequestException(
                    HTTPStatus.UNPROCESSABLE_ENTITY, {"status": "failed", "message": f"missing field: {key}"}
                )
            if not request_data[key]:
                raise InvalidRequestException(
                    HTTPStatus.UNPROCESSABLE_ENTITY, {"status": "failed", "message": f"empty field: {key}"}
                )

    for param in extra_params:
        if param.name not in request_data:
            raise InvalidRequestException(
                HTTPStatus.UNPROCESSABLE_ENTITY, {"status": "failed", "message": f"missing field: {param.name}"}
            )
        if not param.allow_empty and not request_data[param.name]:
            raise InvalidRequestException(
                HTTPStatus.UNPROCESSABLE_ENTITY, {"status": "failed", "message": f"empty field: {param.name}"}
            )


def get_user_from_datastore(user_id: str) -> Optional[Entity]:
    key = datastore_client.key(DATASTORE_KIND_USERS, f"{user_id}")
    return datastore_client.get(key=key)


def create_user(user_id: str, date: datetime, msisdn: str = None) -> Entity:
    key = datastore_client.key(DATASTORE_KIND_USERS, f"{user_id}")

    user = datastore.Entity(key=key)
    user.update({"user_id": user_id, "msisdn": msisdn, "created": date, "status": "orange"})

    datastore_client.put(user)
    return user


def update_user_in_datastore(
    entity: Entity, platform: str, os_version: str, app_version: str, device_type: str, lang: str
) -> None:
    entity.update(
        {
            "platform": platform,
            "os_version": os_version,
            "app_version": app_version,
            "device_type": device_type,
            "lang": lang,
            "last_status_requested": datetime.utcnow(),
        }
    )
    datastore_client.put(entity)
