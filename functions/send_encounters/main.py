import logging
import os
import secrets
from datetime import datetime
from http import HTTPStatus
from typing import Optional

import pytz
from flask import jsonify, Request
from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

from utils import (
    get_request_data,
    validate_request_parameters,
    KEY_USER_ID,
    KEY_PLATFORM,
    KEY_OS_VERSION,
    KEY_DEVICE_TYPE,
    KEY_APP_VERSION,
    KEY_LANG,
    get_user_from_datastore,
    update_user_in_datastore,
    InvalidRequestException,
    ExtraParam,
    DATASTORE_KIND_USERS,
    DATASTORE_KIND_ENCOUNTER_UPLOADS,
)

BQ_TABLE_ID = f"{os.environ['GCP_PROJECT']}.{os.environ['BQ_DATASET']}.{os.environ['BQ_TABLE']}"
KEY_ENCOUNTERS = "encounters"
KEY_ENCOUNTER_DATE = "encounter_date"
KEY_BEACON_ID = "beacon_id"
KEY_SIGNAL_STRENGTH = "signal_strength"

datastore_client = datastore.Client()


def send_encounters(request):
    try:
        request_data = _parse_request(request)
    except InvalidRequestException as e:
        return jsonify(e.response), e.status

    user_id = request_data[KEY_USER_ID]
    platform = request_data[KEY_PLATFORM]
    os_version = request_data[KEY_OS_VERSION]
    device_type = request_data[KEY_DEVICE_TYPE]
    app_version = request_data[KEY_APP_VERSION]
    lang = request_data[KEY_LANG]
    encounters = request_data[KEY_ENCOUNTERS]

    user_entity = get_user_from_datastore(user_id)
    if not user_entity:
        return jsonify({"status": "failed", "message": f"Unauthorized"}), HTTPStatus.UNAUTHORIZED

    upload_id = secrets.token_hex(32)

    _save_encounter_uploads_to_datastore(user_id, upload_id)
    if not _save_encounters_to_bigquery(user_id, upload_id, encounters):
        return jsonify({"status": "failed", "message": "Internal error"}), HTTPStatus.INTERNAL_SERVER_ERROR

    update_user_in_datastore(user_entity, platform, os_version, app_version, device_type, lang)
    return jsonify({"status": "OK"})


def _parse_request(request: Request) -> dict:
    request_data = get_request_data(request)
    validate_request_parameters(request_data, extra_params=[ExtraParam(KEY_ENCOUNTERS)])

    for encounter in request_data[KEY_ENCOUNTERS]:
        for key in [KEY_ENCOUNTER_DATE, KEY_BEACON_ID, KEY_SIGNAL_STRENGTH]:
            if key not in encounter:
                raise InvalidRequestException(
                    HTTPStatus.UNPROCESSABLE_ENTITY,
                    {"status": "failed", "message": f"missing field in {KEY_ENCOUNTERS}: {key}"},
                )

    return request_data


def _get_user_entity(user_id: str) -> Optional[Entity]:
    device_key = datastore_client.key(DATASTORE_KIND_USERS, f"{user_id}")
    return datastore_client.get(key=device_key)


def _save_encounter_uploads_to_datastore(user_id: str, upload_id: str) -> None:
    uploads_key = datastore_client.key(DATASTORE_KIND_ENCOUNTER_UPLOADS, f"{upload_id}")
    entity = datastore.Entity(key=uploads_key)

    entity.update(
        {
            "user_id": user_id,
            "upload_id": upload_id,
            "date": datetime.now(tz=pytz.utc),
            "processed_by_health_authority": False,
            "confirmed_by_health_authority": None,
        }
    )
    datastore_client.put(entity)


def _save_encounters_to_bigquery(user_id: str, upload_id: str, encounters: list) -> bool:
    bq_client = bigquery.Client()
    table = bq_client.get_table(BQ_TABLE_ID)

    rows_to_insert = []
    for encounter in encounters:
        encounter_date = datetime.strptime(encounter[KEY_ENCOUNTER_DATE], "%Y%m%d%H").replace(tzinfo=pytz.utc)
        beacon_id = encounter[KEY_BEACON_ID]
        signal_strength = encounter[KEY_SIGNAL_STRENGTH]
        rows_to_insert.append((upload_id, user_id, encounter_date, beacon_id, signal_strength))

    errors = bq_client.insert_rows(table, rows_to_insert)
    if errors:
        logging.error(f"Unable to save encounters for user_id: {user_id}")
        for e in errors:
            logging.error(e)
        return False

    return True
