import json
import os
import random
import logging
from datetime import datetime
import uuid

import pytz
from flask import jsonify
from google.cloud import datastore

from google.cloud import pubsub_v1


CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
datastore_client = datastore.Client()
publisher = pubsub_v1.PublisherClient()


def register_device(request):
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
    if 'phone_no' not in request_data or not _check_phone_number(request_data['phone_no']):
        return jsonify(
            {
                'status': 'failed',
                'message': 'invalid phone number'
            }
        ), 422

    phone_no = request_data['phone_no']
    code = ''.join(random.choice(CODE_CHARACTERS) for _ in range(5))
    registration_id = str(uuid.uuid4())
    date = datetime.now(tz=pytz.utc)

    _save_to_datastore(code, phone_no, date, registration_id)

    response = {
        'status': 'ok',
        'registration_id': registration_id
    }

    if os.getenv('STAGE', '') == 'DEVELOPMENT':
        response['code'] = code
    elif os.getenv('STAGE', '') == 'PRODUCTION':
        _publish_to_send_register_sms_topic(phone_no, code)

    return jsonify(response)


def _check_phone_number(phone_no: str):
    phone_no = phone_no.strip().replace(' ', '')
    if not phone_no.startswith('+48'):
        logging.warning(f'check_phone_number: invalid prefix: {phone_no}')
        return False
    if len(phone_no) != 12:
        logging.warning(f'check_phone_number: invalid phone_no length: {phone_no}')
        return False

    try:
        int(phone_no)
    except ValueError:
        logging.warning(f'check_phone_number: invalid value: {phone_no}')
        return False

    return True


def _save_to_datastore(code: str, phone_no: str, date: datetime, registration_id: str):
    kind = 'Device'
    task_key = datastore_client.key(kind, f'{phone_no}')

    task = datastore.Entity(key=task_key)
    task.update(
        {
            'code': code,
            'phone_no': phone_no,
            'date': date,
            'registration_id': registration_id,
            'confirmed': False
        }
    )

    datastore_client.put(task)


def _publish_to_send_register_sms_topic(phone_no: str, code: str):
    topic_path = publisher.topic_path(os.getenv('PROJECT_ID', ''), os.getenv('SEND_REGISTER_SMS_TOPIC', ''))
    data = {
        'phone_no': phone_no,
        'code': code
    }
    publisher.publish(topic_path, json.dumps(data).encode('utf-8'))
