import secrets
from datetime import datetime

import pytz
from flask import jsonify
from google.cloud import datastore

datastore_client = datastore.Client()

DATA_STORE_USERS_KIND = "Users"


def register_no_msisdn(request):
    user_id = secrets.token_hex(32)
    date = datetime.now(tz=pytz.utc)
    _save_user_to_datastore(user_id, date)

    return jsonify({"status": "ok", "user_id": user_id})


def _save_user_to_datastore(user_id: str, date: datetime) -> None:
    key = datastore_client.key(DATA_STORE_USERS_KIND, f"{user_id}")
    user = datastore.Entity(key=key)
    user.update({"user_id": user_id, "created": date, "status": "orange"})

    datastore_client.put(user)
