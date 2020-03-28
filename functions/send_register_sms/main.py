import json
import os
import base64
import logging
from smsapi.client import SmsApiPlClient
from smsapi.exception import SmsApiException

token = os.getenv('SMS_API_TOKEN')

client = SmsApiPlClient(access_token=token)


def send_register_sms(event, context):
    if 'data' not in event:
        logging.warning('send_register_sms: no data received')
        return

    try:
        data = json.loads(base64.b64decode(event['data']).decode('utf-8'))
    except Exception as e:
        logging.exception(f'send_register_sms: exception parsing data: {e}')
        return

    if 'phone_no' not in data or 'code' not in data:
        logging.warning('send_register_sms: got incomplete data')

    phone_no = data['phone_no']
    code = data['code']
    message = f"Kod weryfikacyjny do aplikacji Anna: {code}"

    try:
        send_results = client.sms.send(to=phone_no, message=message)
    except SmsApiException as e:
        logging.exception(e.message, e.code, phone_no, code)
        return

    for result in send_results:
        logging.info(result.id, result.points, result.error)
