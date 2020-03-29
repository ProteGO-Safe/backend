import logging
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional

import pytz
from flask import jsonify
from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

NR_BEACON_IDS = 24 * 7

BQ_TABLE = os.environ["BQ_TABLE"]

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

    for key in ["user_id", "platform", "os_version", "device_name", "app_version", "lang"]:
        if key not in request_data:
            return jsonify(
                {
                    'status': 'failed',
                    'message': f'missing field: {key}',
                }
            ), 400

    user_id = request_data["user_id"]
    platform = request_data["platform"]
    os_version = request_data["os_version"]
    device_name = request_data["device_name"]
    app_version = request_data["app_version"]
    lang = request_data["lang"]

    entity = _get_entity_from_datastore(user_id)
    if not entity:
        return jsonify(
            {
                'status': 'failed',
                'message': f'forbidden',
            }
        ), 401

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

    _update_entity(entity, platform, os_version, app_version, device_name, lang)
    return jsonify(
        {
            "status": "orange",
            "beacon_ids": [{
                "date": beacon["date"].strftime("%Y%m%d%H%M%S"),
                "beacon_id": beacon["beacon_id"],
            } for beacon in beacons],
        }
    )


def _get_entity_from_datastore(user_id: str) -> Optional[Entity]:
    kind = "Device"
    query = datastore_client.query(kind=kind)
    query.add_filter('user_id', '=', user_id)
    try:
        return list(query.fetch())[0]
    except IndexError:
        return None


def _update_entity(entity: Entity, platform: str, os_version: str, app_version: str, device_name: str,
                   lang: str) -> None:
    entity.update({
        "platform": platform,
        "os_version": os_version,
        "app_version": app_version,
        "device_name": device_name,
        "lang": lang,
        "last_status_requested": datetime.utcnow(),
    })
    datastore_client.put(entity)


def _generate_beacons():
    return [
        {
            "date": _get_beacon_date(timedelta(hours=i)),
            "beacon_id": str(uuid.uuid4())
        } for i in range(0, NR_BEACON_IDS)
    ]


def _get_beacon_date(delta: timedelta = None) -> datetime:
    delta = delta if delta is not None else timedelta()
    return datetime.utcnow().replace(tzinfo=pytz.utc, minute=0, second=0, microsecond=0) + delta


def _save_beacons_to_bigquery(registration_id, beacons):
    client = bigquery.Client()
    table = client.get_table(BQ_TABLE)

    rows_to_insert = [(registration_id, beacon["beacon_id"], beacon["date"]) for beacon in beacons]

    errors = client.insert_rows(table, rows_to_insert)
    if errors:
        raise SaveToBigQueryFailedException(errors)
