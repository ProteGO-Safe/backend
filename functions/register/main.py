import os

from google.cloud import storage


BUCKET_NAME = os.environ["SA_BUCKET"]
FILE_NAME = os.environ["SA_FILE_NAME"]


def register(request):
    if request.method != "POST":
        return "Wrong method", 405
    if not request.json:
        return "Content-Type is not `application/json` type", 415
    if not request.get_json().get("DOCTOR_ID"):
        return "Missing or empty 'DOCTOR_ID' value", 404
    credentials = _get_credentials()
    return credentials, 200, {"Content-Type": "application/json"}


def _get_credentials() -> str:
    client = storage.Client()
    blob = client.get_bucket(BUCKET_NAME).blob(FILE_NAME)
    return blob.download_as_string()
