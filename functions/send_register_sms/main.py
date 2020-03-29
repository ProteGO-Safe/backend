import json
import os
import base64
import logging

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
    code = data["code"]
    message = f"Kod weryfikacyjny do aplikacji Anna: {code}"

    try:
        send_results = client.sms.send(to=msisdn, message=message)
    except SmsApiException as e:
        logging.exception(e.message, e.code, msisdn, code)
        return

    for result in send_results:
        logging.info(result.id, result.points, result.error)

    _update_entity(msisdn)


def _update_entity(msisdn: str):
    kind = 'Registrations'
    key = datastore_client.key(kind, f'{msisdn}')

    registration = datastore.Entity(key=key)
    registration.update(
        {
            'sms_send': True,
        }
    )

    datastore_client.put(registration)
