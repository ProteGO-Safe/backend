import logging
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

from flask import jsonify
from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

BEACON_DATE_FORMAT = "%Y%m%d%H"
MAX_NR_OF_BEACON_IDS = 21 * 24  # 21 days x 24 hours
BQ_TABLE_ID = f"{os.environ['GCP_PROJECT']}.{os.environ['BQ_DATASET']}.{os.environ['BQ_TABLE']}"

datastore_client = datastore.Client()


class SaveToBigQueryFailedException(Exception):
    bq_errors = None

    def __init__(self, bq_errors):
        self.bq_errors = bq_errors


def get_status(request):
    if not request.is_json:
        return jsonify(
            {'status': 'failed',
             'message': 'invalid data'
             }
        ), 422

    request_data = request.get_json()

    for key in ["user_id", "platform", "os_version", "device_type", "app_version", "lang", "last_beacon_date"]:
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
    last_beacon_date = request_data.get["last_beacon_date"]

    user_entity = _get_user_entity(user_id)
    if not user_entity:
        return jsonify(
            {
                'status': 'failed',
                'message': f'unauthorized',
            }
        ), 401

    beacons = _generate_beacons(last_beacon_date)
    if not _save_beacons_to_bigquery(user_id, beacons):
        beacons = []  # if saving beacons to BigQuery failed, return no new beacons

    _update_user_entity(user_entity, platform, os_version, app_version, device_type, lang)
    return jsonify(
        {
            "status": user_entity['status'],
            "beacon_ids": [{
                "date": beacon["date"].strftime(BEACON_DATE_FORMAT),
                "beacon_id": beacon["beacon_id"],
            } for beacon in beacons],
        }
    )


def _get_user_entity(user_id: str) -> Optional[Entity]:
    kind = "Users"
    device_key = datastore_client.key(kind, f"{user_id}")
    return datastore_client.get(key=device_key)


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


def _generate_beacons(last_beacon_date_str: str) -> list:
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    if last_beacon_date_str:
        last_beacon_date = datetime.strptime(last_beacon_date_str, BEACON_DATE_FORMAT)
    else:
        last_beacon_date = now

    last_beacon_date_should_be = now + timedelta(hours=MAX_NR_OF_BEACON_IDS)
    diff = (last_beacon_date_should_be - last_beacon_date)
    diff_in_hours = int(diff.total_seconds() / 3600) + 1

    return [
        {
            "date": last_beacon_date + timedelta(hours=i),
            "beacon_id": secrets.token_hex(16)
        } for i in range(0, diff_in_hours)
    ]


def _save_beacons_to_bigquery(user_id: str, beacons: list) -> bool:
    if not beacons:
        return True

    client = bigquery.Client()
    table = client.get_table(BQ_TABLE_ID)

    rows_to_insert = [(user_id, beacon["beacon_id"], beacon["date"]) for beacon in beacons]

    errors = client.insert_rows(table, rows_to_insert)
    if errors:
        logging.error(f'Unable to save beacon_ids for user_id: {user_id}')
        for e in errors:
            logging.error(e)
        return False

    return True
