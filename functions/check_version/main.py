from flask import jsonify
from rate_limit import limit_requests


@limit_requests()
def check_version(request):
    return jsonify({"upgrade_required": False, "upgrade_url": ""}), 200
