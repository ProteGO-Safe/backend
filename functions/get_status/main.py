import logging
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

import pytz
from flask import jsonify
from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

NR_BEACON_IDS = 24 * 7
BEACON_DATE_FORMAT = "%Y%m%d%H"
MINIMAL_BEACON_TTL_IN_DAYS = 2
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

    beacons = []
    if _should_generate_beacons(last_beacon_date):
        beacons = _generate_beacons()
        try:
            # This must be synchronous call - successful saving beacon_ids to BigQuery is essential
            _save_beacons_to_bigquery(user_id, beacons)
        except SaveToBigQueryFailedException as error:
            logging.error(f'Unable to save beacon_ids for user_id: {user_id}')
            for e in error.bq_errors:
                logging.error(e)
            return jsonify(
                {'status': 'failed',
                 'message': 'internal exception'
                 }
            ), 500

    _update_user_entity(user_entity, platform, os_version, app_version, device_type, lang)
    return jsonify(
        {
            "status": "orange",
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


# New beacons should be generated if last beacon date is closer than {MINIMAL_BEACON_TTL_IN_DAYS} days from now
def _should_generate_beacons(last_beacon_date_str: str) -> bool:
    last_beacon_date = datetime.strptime(last_beacon_date_str, BEACON_DATE_FORMAT)
    return last_beacon_date < (datetime.today() + timedelta(days=2))


def _generate_beacons():
    return [
        {
            "date": _get_beacon_date(timedelta(hours=i)),
            "beacon_id": secrets.token_hex(16)
        } for i in range(0, NR_BEACON_IDS)
    ]


def _get_beacon_date(delta: timedelta = None) -> datetime:
    delta = delta if delta is not None else timedelta()
    return datetime.utcnow().replace(tzinfo=pytz.utc, minute=0, second=0, microsecond=0) + delta


def _save_beacons_to_bigquery(user_id, beacons):
    client = bigquery.Client()
    table = client.get_table(BQ_TABLE_ID)

    rows_to_insert = [(user_id, beacon["beacon_id"], beacon["date"]) for beacon in beacons]

    errors = client.insert_rows(table, rows_to_insert)
    if errors:
        raise SaveToBigQueryFailedException(errors)
