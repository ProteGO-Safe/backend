import os
import random
import logging
from datetime import datetime

import pytz
from flask import jsonify
from google.cloud import datastore

CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
datastore_client = datastore.Client()


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
    date = datetime.now(tz=pytz.utc)

    _save_to_datastore(code, phone_no, date)

    response = {'status': 'ok'}

    if os.getenv('STAGE', '') == 'DEVELOPMENT':
        response['code'] = code
    elif os.getenv('STAGE', '') == 'PRODUCTION':
        # todo: send sms via SMSAPI
        pass

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


def _save_to_datastore(code: str, phone_no: str, date: datetime):
    kind = 'Device'
    task_key = datastore_client.key(kind, f'{code}{phone_no}')

    task = datastore.Entity(key=task_key)
    task.update(
        {
            'code': code,
            'phone_no': phone_no,
            'date': date,
        }
    )

    datastore_client.put(task)
