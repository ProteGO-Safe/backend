from flask import jsonify


def check_version(request):
    return jsonify({"upgrade_required": False, "upgrade_url": ""}), 200
