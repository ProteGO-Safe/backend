import base64
import json
import logging
import os

from smsapi.client import SmsApiPlClient
from smsapi.exception import SmsApiException

from commons.datastore import get_entity_by_key, REGISTRATIONS, update_entity

token = os.environ["SMS_API_TOKEN"]
DEFAULT_LANG = "pl"

client = SmsApiPlClient(access_token=token)


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
    lang = data.get("lang")
    if lang not in ("pl", "en"):
        logging.warning(f"send_register_sms: invalid lang: {lang}")
        lang = DEFAULT_LANG
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
    entity = get_entity_by_key(REGISTRATIONS, registration_id)
    update_entity(entity, {"sms_send": True})
