from datetime import datetime, timedelta
from unittest import TestCase

import pytz
import requests
from google.cloud import datastore

from commons.datastore import REGISTRATIONS, USERS
from commons.messages import get_message, MESSAGE_INVALID_DATA, MESSAGE_REGISTRATION_EXPIRED
from tests.common import BASE_URL

CONFIRM_REGISTRATION_ENDPOINT = "confirm_registration"
INVALID_REGS_PER_IP_LIMIT = 10
INVALID_REGS_PER_MSISDN_LIMIT = 4

NUMBER_PREFIX = "+48"
REGISTRATION_STATUS_COMPLETED = "completed"
REGISTRATION_STATUS_PENDING = "pending"

LANG = "pl"

datastore_client = datastore.Client()


class TestConfirmRegistration(TestCase):
    def setUp(self) -> None:
        self.registrations_entities_ids_to_delete = []
        self.users_entities_ids_to_delete = []

    def tearDown(self) -> None:
        keys = []
        for id_ in self.registrations_entities_ids_to_delete:
            key = datastore_client.key(REGISTRATIONS, id_)
            keys.append(key)
        for id_ in self.users_entities_ids_to_delete:
            key = datastore_client.key(USERS, id_)
            keys.append(key)

        datastore_client.delete_multi(keys=keys)

    def test_invalid_method(self):
        response = requests.get(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}")
        assert response.status_code == 405

    def test_invalid_data_format(self):
        invalid_data_sets = [{"mock": "mock"}, {"code": "code"}, {"registration_id": "mock"}]
        for data in invalid_data_sets:
            response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", data=data)
            assert response.status_code == 422
            assert response.json()["message"] == "Invalid data"

    def test_no_lang(self):
        response = requests.post(
            f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json={"code": "code", "registration_id": "registration_id"}
        )
        assert response.status_code == 422
        assert response.json()["message"] == "Set lang parameter to pl or en"

    def test_no_registration_entity(self):
        request_data = {"code": "code", "registration_id": "mock", "lang": LANG}
        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 422
        assert response.json()["message"] == get_message(MESSAGE_INVALID_DATA, LANG)

    def test_already_completed_registration(self):
        registration_id = "registration_id_mock"
        request_data = {"code": "code", "registration_id": registration_id, "lang": LANG}

        key = datastore_client.key(REGISTRATIONS, registration_id)
        registration = datastore.Entity(key=key)
        registration.update(
            {
                "code": "code",
                "msisdn": "msisdn",
                "date": datetime.now(tz=pytz.utc),
                "registration_id": registration_id,
                "sms_send": False,
                "ip": "ip",
                "status": REGISTRATION_STATUS_COMPLETED,
            }
        )

        datastore_client.put(registration)

        self.registrations_entities_ids_to_delete.append(registration_id)
        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 422
        assert response.json()["message"] == get_message(MESSAGE_INVALID_DATA, LANG)

    def test_confirmation_per_msisdn_reached(self):
        registrations = []
        for i in range(4):
            registration_id = f"registration_id_{i}"
            self.registrations_entities_ids_to_delete.append(registration_id)
            key = datastore_client.key(REGISTRATIONS, registration_id)
            registration = datastore.Entity(key=key)
            registration.update(
                {
                    "code": "code",
                    "msisdn": "mock_msisdn",
                    "date": datetime.now(tz=pytz.utc),
                    "registration_id": registration_id,
                    "sms_send": False,
                    "ip": "ip",
                    "status": REGISTRATION_STATUS_PENDING,
                }
            )

            registrations.append(registration)

        datastore_client.put_multi(registrations)
        request_data = {"code": "code", "registration_id": self.registrations_entities_ids_to_delete[3], "lang": LANG}
        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 422
        assert response.json()["message"] == get_message(MESSAGE_INVALID_DATA, LANG)

    def test_registration_expired(self):
        registration_id = "registration_id_mock"
        request_data = {"code": "code", "registration_id": registration_id, "lang": LANG}

        key = datastore_client.key(REGISTRATIONS, registration_id)
        registration = datastore.Entity(key=key)
        registration.update(
            {
                "code": "code",
                "msisdn": "msisdn",
                "date": datetime.now(tz=pytz.utc) - timedelta(minutes=11),
                "registration_id": registration_id,
                "sms_send": False,
                "ip": "ip",
                "status": REGISTRATION_STATUS_PENDING,
            }
        )

        datastore_client.put(registration)

        self.registrations_entities_ids_to_delete.append(registration_id)
        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 422
        assert response.json()["message"] == get_message(MESSAGE_REGISTRATION_EXPIRED, LANG)

    def test_invalid_code(self):
        registration_id = "registration_id_mock"
        request_data = {"code": "code", "registration_id": registration_id, "lang": LANG}

        key = datastore_client.key(REGISTRATIONS, registration_id)
        registration = datastore.Entity(key=key)
        registration.update(
            {
                "code": "code_1",
                "msisdn": "msisdn",
                "date": datetime.now(tz=pytz.utc),
                "registration_id": registration_id,
                "sms_send": False,
                "ip": "ip",
                "status": REGISTRATION_STATUS_PENDING,
            }
        )

        datastore_client.put(registration)

        self.registrations_entities_ids_to_delete.append(registration_id)
        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 422
        assert response.json()["message"] == get_message(MESSAGE_INVALID_DATA, LANG)

    def test_user_already_exists(self):
        registration_id = "registration_id_mock"
        request_data = {"code": "code", "registration_id": registration_id, "lang": LANG}

        key = datastore_client.key(REGISTRATIONS, registration_id)
        registration = datastore.Entity(key=key)
        registration.update(
            {
                "code": "code",
                "msisdn": "msisdn_1",
                "date": datetime.now(tz=pytz.utc),
                "registration_id": registration_id,
                "sms_send": False,
                "ip": "ip",
                "status": REGISTRATION_STATUS_PENDING,
            }
        )

        user_id = "mock_user_id"
        key = datastore_client.key(USERS, user_id)
        user = datastore.Entity(key=key)
        user.update(
            {
                "user_id": user_id,
                "msisdn": "msisdn_1",
                "created": datetime.now(tz=pytz.utc) - timedelta(minutes=30),
                "status": "orange",
            }
        )

        datastore_client.put_multi([registration, user])

        self.registrations_entities_ids_to_delete.append(registration_id)
        self.users_entities_ids_to_delete.append(user_id)

        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 200
        assert response.json()["user_id"] == user_id

    def test_confirm_registration_new_user(self):
        registration_id = "registration_id_mock"
        request_data = {"code": "code", "registration_id": registration_id, "lang": LANG}

        key = datastore_client.key(REGISTRATIONS, registration_id)
        registration = datastore.Entity(key=key)
        registration.update(
            {
                "code": "code",
                "msisdn": "msisdn",
                "date": datetime.now(tz=pytz.utc),
                "registration_id": registration_id,
                "sms_send": False,
                "ip": "ip",
                "status": REGISTRATION_STATUS_PENDING,
            }
        )

        datastore_client.put(registration)

        self.registrations_entities_ids_to_delete.append(registration_id)

        response = requests.post(f"{BASE_URL}{CONFIRM_REGISTRATION_ENDPOINT}", json=request_data)
        assert response.status_code == 200
        user_id = response.json()["user_id"]

        key = datastore_client.key(USERS, user_id)
        user = datastore_client.get(key=key)
        assert user["msisdn"] == registration["msisdn"]

        self.users_entities_ids_to_delete.append(user_id)
