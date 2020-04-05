import os
import random
from http import HTTPStatus
from string import digits
from unittest import TestCase

import requests

from google.cloud import datastore

from tests.common import BASE_URL, STAGE
from utils import DATASTORE_KIND_REGISTRATIONS

REGISTER_ENDPOINT = "register"
INVALID_REGS_PER_IP_LIMIT = 10
INVALID_REGS_PER_MSISDN_LIMIT = 4
NUMBER_PREFIX = "+48"

if STAGE == "PRODUCTION":
    SEND_SMS_NUMBER = NUMBER_PREFIX + os.environ["SEND_SMS_NUMBER"]
else:
    SEND_SMS_NUMBER = NUMBER_PREFIX + "".join(random.choice(digits) for _ in range(9))

datastore_client = datastore.Client()


class TestRegisterDevice(TestCase):
    def setUp(self) -> None:
        self.entities_ids_to_delete = []

    def tearDown(self) -> None:
        keys = []
        for id_ in self.entities_ids_to_delete:
            key = datastore_client.key(DATASTORE_KIND_REGISTRATIONS, id_)
            keys.append(key)

        datastore_client.delete_multi(keys=keys)

    def test_invalid_method(self):
        response = requests.get(f"{BASE_URL}{REGISTER_ENDPOINT}")
        assert response.status_code == HTTPStatus.METHOD_NOT_ALLOWED

    def test_invalid_data_format(self):
        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", data={"a": "b"})
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
        assert response.json()["message"] == "Invalid data"

    def test_no_msisdn(self):
        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={})
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
        assert response.json()["message"] == "Invalid phone number"

    def test_invalid_msisdn(self):
        invalid_numbers = ["123123123", "1231231231", "+50123123123"]
        for number in invalid_numbers:
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})
            assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
            assert response.json()["message"] == "Invalid phone number"

    def test_too_many_requests_for_ip(self):
        for i in range(INVALID_REGS_PER_IP_LIMIT):
            number = NUMBER_PREFIX + "".join(random.choice(digits) for _ in range(9))
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})
            self.entities_ids_to_delete.append(response.json()["registration_id"])

        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": "+48123123123"})

        assert response.status_code == HTTPStatus.TOO_MANY_REQUESTS
        assert response.json()["message"] == "Registration temporarily not available. Try again in an hour"

    def test_too_many_requests_for_msdin(self):
        number = NUMBER_PREFIX + "".join(random.choice(digits) for _ in range(9))
        for _ in range(INVALID_REGS_PER_MSISDN_LIMIT):
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})
            self.entities_ids_to_delete.append(response.json()["registration_id"])

        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})

        assert response.status_code == HTTPStatus.TOO_MANY_REQUESTS
        assert response.json()["message"] == "Registration temporarily not available. Try again in an hour"

    def test_get_pending_registration_code(self):
        keys = []
        for _ in range(3):
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": SEND_SMS_NUMBER})
            registration_id = response.json()["registration_id"]
            self.entities_ids_to_delete.append(registration_id)
            key = datastore_client.key(DATASTORE_KIND_REGISTRATIONS, registration_id)
            keys.append(key)

            assert response.status_code == HTTPStatus.OK

        codes = [entity["code"] for entity in datastore_client.get_multi(keys)]

        assert all(code == codes[0] for code in codes)
