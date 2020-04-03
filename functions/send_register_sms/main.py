import base64
import json
import logging
import os

from google.cloud import datastore
from smsapi.client import SmsApiPlClient
from smsapi.exception import SmsApiException

token = os.environ["SMS_API_TOKEN"]

client = SmsApiPlClient(access_token=token)

datastore_client = datastore.Client()


def send_register_sms(event, context):
    if "data" not in event:
        logging.warning("send_register_sms: no data received")
        return

    try:
        data = json.loads(base64.b64decode(event["data"]).decode("utf-8"))
    except Exception as e:
        logging.exception(f"send_register_sms: exception parsing data: {e}")
        return

    if "msisdn" not in data or "code" not in data:
        logging.warning("send_register_sms: got incomplete data")
        return

    msisdn = data["msisdn"]
    registration_id = data["registration_id"]
    code = data["code"]
    lang = data["lang"]
    if lang == "pl":
        message = f"Twój kod dla ProteGO to: {code}"
    else:
        message = f"Your ProteGO code is: {code}"

    try:
        send_results = client.sms.send(to=msisdn, message=message, encoding="utf-8")
    except SmsApiException as e:
        logging.exception(e.message, e.code, msisdn, code)
        return

    for result in send_results:
        logging.info(f"{result.id}, {result.points}, {result.error}")

    _update_entity(registration_id)


def _update_entity(registration_id: str):
    kind = "Registrations"
    key = datastore_client.key(kind, f"{registration_id}")

    registration = datastore_client.get(key=key)
    registration.update({"sms_send": True})

    datastore_client.put(registration)
