import logging
import os
import secrets
from datetime import datetime, timedelta
from http import HTTPStatus

import pytz
from flask import jsonify
from google.cloud import bigquery, datastore

from utils import (
    get_request_data,
    validate_request_parameters,
    InvalidRequestException,
    KEY_USER_ID,
    KEY_PLATFORM,
    KEY_OS_VERSION,
    KEY_DEVICE_TYPE,
    KEY_APP_VERSION,
    KEY_LANG,
    ExtraParam,
    get_user_from_datastore,
    update_user_in_datastore,
)

BEACON_DATE_FORMAT = "%Y%m%d%H"
MAX_NR_OF_BEACON_IDS = 21 * 24  # 21 days x 24 hours
GENERATE_BEACONS_THRESHOLD = 24  # if there is less beacons to generate than this value, don't generate
BQ_TABLE_ID = f"{os.environ['GCP_PROJECT']}.{os.environ['BQ_DATASET']}.{os.environ['BQ_TABLE']}"
KEY_LAST_BEACON_DATE = "last_beacon_date"

datastore_client = datastore.Client()


class SaveToBigQueryFailedException(Exception):
    bq_errors = None

    def __init__(self, bq_errors):
        self.bq_errors = bq_errors


def get_status(request):
    try:
        request_data = get_request_data(request)
        validate_request_parameters(request_data, extra_params=[ExtraParam(KEY_LAST_BEACON_DATE, True)])
    except InvalidRequestException as e:
        return jsonify(e.response), e.status

    user_id = request_data[KEY_USER_ID]
    platform = request_data[KEY_PLATFORM]
    os_version = request_data[KEY_OS_VERSION]
    device_type = request_data[KEY_DEVICE_TYPE]
    app_version = request_data[KEY_APP_VERSION]
    lang = request_data[KEY_LANG]
    last_beacon_date = request_data[KEY_LAST_BEACON_DATE]

    user_entity = get_user_from_datastore(user_id)
    if not user_entity:
        return jsonify({"status": "failed", "message": f"Unauthorized"}), HTTPStatus.UNAUTHORIZED

    beacons = _generate_beacons(last_beacon_date)
    if not _save_beacons_to_bigquery(user_id, beacons):
        beacons = []  # if saving beacons to BigQuery failed, return no new beacons

    update_user_in_datastore(user_entity, platform, os_version, app_version, device_type, lang)
    return jsonify(
        {
            "status": user_entity["status"],
            "beacon_ids": [
                {"date": beacon["date"].strftime(BEACON_DATE_FORMAT), "beacon_id": beacon["beacon_id"]} for beacon in beacons
            ],
        }
    )


def _generate_beacons(last_beacon_date_str: str) -> list:
    now = datetime.now().replace(minute=0, second=0, microsecond=0, tzinfo=pytz.utc)
    if last_beacon_date_str:
        last_beacon_date = datetime.strptime(last_beacon_date_str, BEACON_DATE_FORMAT)
    else:
        last_beacon_date = now

    last_beacon_date_should_be = now + timedelta(hours=MAX_NR_OF_BEACON_IDS)
    diff = last_beacon_date_should_be - last_beacon_date
    diff_in_hours = int(diff.total_seconds() / 3600) + 1
    if diff_in_hours < GENERATE_BEACONS_THRESHOLD:
        return []
    return [
        {"date": last_beacon_date + timedelta(hours=i), "beacon_id": secrets.token_hex(16)} for i in range(1, diff_in_hours)
    ]


def _save_beacons_to_bigquery(user_id: str, beacons: list) -> bool:
    if not beacons:
        return True

    client = bigquery.Client()
    table = client.get_table(BQ_TABLE_ID)

    rows_to_insert = [(user_id, beacon["beacon_id"], beacon["date"]) for beacon in beacons]

    errors = client.insert_rows(table, rows_to_insert)
    if errors:
        logging.error(f"Unable to save beacon_ids for user_id: {user_id}")
        for e in errors:
            logging.error(e)
        return False

    return True
