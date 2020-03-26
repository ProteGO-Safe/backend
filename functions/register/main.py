import os

from google.cloud import storage
from flask import json, jsonify


BUCKET_NAME = os.environ["SA_BUCKET"]
FILE_NAME = os.environ["SA_FILE_NAME"]


def register(request):
    if request.method != "POST":
        return "Wrong method", 404
    if not request.form.get("DOCTOR_ID"):
        return "Missing or empty 'DOCTOR_ID' field", 404
    credentials = _get_credentials()
    return jsonify({"credentials": credentials})


def _get_credentials() -> str:
    client = storage.Client()
    blob = client.get_bucket(BUCKET_NAME).blob(FILE_NAME)
    return json.loads(blob.download_as_string())
