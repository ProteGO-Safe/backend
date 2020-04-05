import secrets
from datetime import datetime

import pytz
from flask import jsonify

from utils import create_user


def register_no_msisdn(request):
    user_id = secrets.token_hex(32)
    date = datetime.now(tz=pytz.utc)
    create_user(user_id, date)

    return jsonify({"status": "ok", "user_id": user_id})
