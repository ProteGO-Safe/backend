from typing import Optional
import uuid
from flask import jsonify
from google.cloud import datastore
from google.cloud.datastore import Entity

datastore_client = datastore.Client()


def confirm_registration(request):
    if request.method != "POST":
        return jsonify(
            {'status': 'failed',
             'message': 'Invalid method'
             }
        ), 405

    if not request.is_json or 'phone_no' not in request.get_json() or 'code' not in request.get_json():
        return jsonify(
            {'status': 'failed',
             'message': 'invalid data'
             }
        ), 422
    request_data = request.get_json()

    phone_no = request_data['phone_no']
    code = request_data['code']

    entity =_get_from_datastore(phone_no)

    if not entity or entity['code'] != code:
        return jsonify(
            {'status': 'failed',
             'message': 'invalid data'
             }
        ), 422

    user_id = str(uuid.uuid4())

    _update_entity(entity, user_id)

    return jsonify(
        {
            'status': 'ok',
            'user_id': user_id,
        }
    )


def _get_from_datastore(phone_no: str) -> Optional[Entity]:
    kind = 'Device'
    task_key = datastore_client.key(kind, f'{phone_no}')
    return datastore_client.get(key=task_key)


def _update_entity(entity: Entity, user_id, confirmed=True):
    entity['user_id'] = user_id
    entity['confirmed'] = confirmed
    datastore_client.put(entity)
