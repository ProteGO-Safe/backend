import json
import os
import random
import logging
import secrets
from datetime import datetime

import pytz
from flask import jsonify
from google.cloud import datastore

from google.cloud import pubsub_v1

PROJECT_ID = os.environ['GCP_PROJECT']
PUBSUB_SEND_REGISTER_SMS_TOPIC = os.environ['PUBSUB_SEND_REGISTER_SMS_TOPIC']
STAGE = os.environ['STAGE']

CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
datastore_client = datastore.Client()
publisher = pubsub_v1.PublisherClient()


def register(request):
    if request.method != "POST":
        return jsonify(
            {'status': 'failed',
             'message': 'Invalid method'
             }
        ), 405

    if not request.is_json:
        return jsonify(
            {'status': 'failed',
             'message': 'invalid data'
             }
        ), 422
    request_data = request.get_json()
    if 'msisdn' not in request_data or not _check_phone_number(request_data['msisdn']):
        return jsonify(
            {
                'status': 'failed',
                'message': 'invalid phone number'
            }
        ), 422

    msisdn = request_data['msisdn']
    code = ''.join(random.choice(CODE_CHARACTERS) for _ in range(5))
    registration_id = secrets.token_hex(32)
    date = datetime.now(tz=pytz.utc)

    _save_to_datastore(code, msisdn, date, registration_id, request.remote_addr)

    response = {
        'status': 'ok',
        'registration_id': registration_id
    }

    send_sms = request_data.get('send_sms', True)
    if STAGE == 'DEVELOPMENT' and not send_sms:
        response['code'] = code
    else:
        _publish_to_send_register_sms_topic(msisdn, registration_id, code)

    return jsonify(response)


def _check_phone_number(msisdn: str):
    msisdn = msisdn.strip().replace(' ', '')
    if not msisdn.startswith('+48'):
        logging.warning(f'check_phone_number: invalid prefix: {msisdn}')
        return False
    if len(msisdn) != 12:
        logging.warning(f'check_phone_number: invalid msisdn length: {msisdn}')
        return False

    try:
        int(msisdn)
    except ValueError:
        logging.warning(f'check_phone_number: invalid value: {msisdn}')
        return False

    return True


def _save_to_datastore(code: str, msisdn: str, date: datetime, registration_id: str, ip: str):
    kind = 'Registrations'
    key = datastore_client.key(kind, f'{registration_id}')

    registration = datastore.Entity(key=key)
    registration.update(
        {
            'code': code,
            'msisdn': msisdn,
            'date': date,
            'registration_id': registration_id,
            'sms_send': False,
            'ip': ip,
            'confirmed': False
        }
    )

    datastore_client.put(registration)


def _publish_to_send_register_sms_topic(msisdn: str, registration_id: str, code: str):
    topic_path = publisher.topic_path(PROJECT_ID, PUBSUB_SEND_REGISTER_SMS_TOPIC)
    data = {
        'registration_id': registration_id,
        'msisdn': msisdn,
        'code': code
    }
    publisher.publish(topic_path, json.dumps(data).encode('utf-8'))
