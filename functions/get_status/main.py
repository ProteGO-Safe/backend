from datetime import datetime

from flask import jsonify
import pytz
import uuid


def get_status(request):
    return jsonify(
        {
            "status": "orange",
            "beacon_ids": [
                {"date": _now(), "beacon_id": uuid.uuid1()}
            ],
        }
    )


def _now():
    return datetime.utcnow().replace(tzinfo=pytz.utc).strftime("%Y%m%d%H")
