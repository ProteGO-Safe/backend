import os
import uuid
from typing import Optional

import pytz
import logging
from datetime import datetime, timedelta
from flask import jsonify

from google.cloud import bigquery, datastore
from google.cloud.datastore import Entity

NR_BEACON_IDS = 24 * 7

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

    for key in ["registration_id", "platform", "os_version", "device_name", "app_version", "lang"]:
        if key not in request_data:
            return jsonify(
                {
                    'status': 'failed',
                    'message': f'missing field: {key}',
                }
            ), 400

    registration_id = request_data["registration_id"]

    entity = _get_from_datastore(registration_id)
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
        _save_beacons(registration_id, beacons)
    except SaveToBigQueryFailedException as error:
        logging.error(f'Unable to save beacon_ids for registration_id: {registration_id}')
        for e in error.bq_errors:
            logging.error(e)
        return jsonify(
            {'status': 'failed',
             'message': 'internal exception'
             }
        ), 500

    _update_entity(entity, request_data)
    return jsonify(
        {
            "status": "orange",
            "beacon_ids": [{
                "date": beacon["date"].strftime("%Y%m%d%H%M%S"),
                "beacon_id": beacon["beacon_id"],
            } for beacon in beacons],
        }
    )


def _get_from_datastore(registration_id: str) -> Optional[Entity]:
    kind = "Device"
    query = datastore_client.query(kind=kind)
    query.add_filter('registration_id', '=', registration_id)
    try:
        return list(query.fetch())[0]
    except IndexError:
        return None


def _update_entity(entity: Entity, data: dict) -> None:
    entity['platform'] = data['platform']
    entity['os_version'] = data['os_version']
    entity['device_name'] = data['device_name']
    entity['app_version'] = data['app_version']
    entity['lang'] = data['lang']
    entity['last_status_requested'] = datetime.utcnow()
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


def _save_beacons(registration_id, beacons):
    client = bigquery.Client()
    table = client.get_table(os.getenv("BQ_TABLE"))

    rows_to_insert = [(registration_id, beacon["beacon_id"], beacon["date"]) for beacon in beacons]

    errors = client.insert_rows(table, rows_to_insert)
    if errors:
        raise SaveToBigQueryFailedException(errors)
