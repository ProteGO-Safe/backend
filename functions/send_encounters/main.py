import logging
import os
import secrets
from datetime import datetime
from typing import Optional

from flask import jsonify
from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

BQ_TABLE_ID = f"{os.environ['GCP_PROJECT']}.{os.environ['BQ_DATASET']}.{os.environ['BQ_TABLE']}"

datastore_client = datastore.Client()


def send_encounters(request):
    if not request.is_json:
        return jsonify(
            {'status': 'failed',
             'message': 'invalid data'
             }
        ), 422

    request_data = request.get_json()

    for key in ["user_id", "platform", "os_version", "device_type", "app_version", "lang", "encounters"]:
        if key not in request_data:
            return jsonify(
                {
                    'status': 'failed',
                    'message': f'missing field: {key}',
                }
            ), 422

    user_id = request_data["user_id"]
    platform = request_data["platform"]
    os_version = request_data["os_version"]
    device_type = request_data["device_type"]
    app_version = request_data["app_version"]
    lang = request_data["lang"]
    encounters = request_data["encounters"]

    user_entity = _get_user_entity(user_id)
    upload_id = secrets.token_hex(32)
    if not user_entity:
        return jsonify(
            {
                'status': 'failed',
                'message': f'unauthorized',
            }
        ), 401
    rows_to_insert = []
    for encounter in encounters:
        for key in ["encounter_date", "beacon_id", "signal_strength"]:
            if key not in encounter:
                return jsonify(
                    {
                        'status': 'failed',
                        'message': f'missing field: {key}',
                    }
                ), 422
        encounter_date = datetime.strptime(encounter["encounter_date"], "%Y%m%d%H")
        beacon_id = encounter["beacon_id"]
        signal_strength = encounter["signal_strength"]
        rows_to_insert.append(
            (
                upload_id,
                user_id,
                encounter_date,
                beacon_id,
                signal_strength
            )
        )

    bq_client = bigquery.Client()
    table = bq_client.get_table(BQ_TABLE_ID)
    errors = bq_client.insert_rows(table, rows_to_insert)
    if errors:
        logging.error(f'Unable to save encounters for user_id: {user_id}')
        for e in errors:
            logging.error(e)
        return jsonify(
            {'status': 'failed',
             'message': 'internal exception'
             }
        ), 500

    _save_encounters(user_id, upload_id)
    _update_user_entity(user_entity, platform, os_version, app_version, device_type, lang)
    return jsonify({"status": "OK"})


def _get_user_entity(user_id: str) -> Optional[Entity]:
    kind = "Users"
    device_key = datastore_client.key(kind, f"{user_id}")
    return datastore_client.get(key=device_key)


def _save_encounters(user_id: str, upload_id: str) -> None:
    kind = "Encounter Uploads"
    uploads_key = datastore_client.key(kind, f"{upload_id}")
    entity = datastore.Entity(key=uploads_key)
    entity.update(
    {
        'user_id': user_id,
        'upload_id': upload_id,
        'date': datetime.utcnow(),
    })

    datastore_client.put(entity)


def _update_user_entity(entity: Entity, platform: str, os_version: str, app_version: str, device_type: str,
                        lang: str) -> None:
    entity.update({
        "platform": platform,
        "os_version": os_version,
        "app_version": app_version,
        "device_type": device_type,
        "lang": lang,
        "last_status_requested": datetime.utcnow(),
    })
    datastore_client.put(entity)
