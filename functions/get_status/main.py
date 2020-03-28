from datetime import datetime, timedelta

from flask import jsonify
import pytz
import uuid


NR_BEACON_IDS = 24 * 7


def get_status(request):
    return jsonify(
        {
            "status": "orange",
            "beacon_ids": [
                {"date": _now(timedelta(hours=i)), "beacon_id": uuid.uuid4()}
                for i in range(0, NR_BEACON_IDS)
            ],
        }
    )


def _now(delta: timedelta = None) -> str:
    delta = delta if delta is not None else timedelta()
    now = datetime.utcnow().replace(tzinfo=pytz.utc) + delta
    return now.strftime("%Y%m%d%H")
