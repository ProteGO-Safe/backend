import os
import random
from datetime import datetime, timedelta
from string import digits
from typing import List
from unittest import TestCase

import pytz
import requests

from google.cloud import datastore
from google.cloud.datastore import Entity

from tests.common import BASE_URL

REGISTER_ENDPOINT = "register"
INVALID_REGS_PER_IP_LIMIT = 10
INVALID_REGS_PER_MSISDN_LIMIT = 4
DATA_STORE_REGISTRATION_KIND = "Registrations"
NUMBER_PREFIX = "+48"

SEND_SMS_NUMBER = NUMBER_PREFIX + os.environ["SEND_SMS_NUMBER"]

datastore_client = datastore.Client()


class TestRegisterDevice(TestCase):
    def setUp(self) -> None:
        self.entities_ids_to_delete = []

    def tearDown(self) -> None:
        keys = []
        for id_ in self.entities_ids_to_delete:
            key = datastore_client.key(DATA_STORE_REGISTRATION_KIND, id_)
            keys.append(key)

        datastore_client.delete_multi(keys=keys)

    def test_invalid_method(self):
        response = requests.get(f"{BASE_URL}{REGISTER_ENDPOINT}")
        assert response.status_code == 405

    def test_invalid_data_format(self):
        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", data={"a": "b"})
        assert response.status_code == 422
        assert response.json()["message"] == "Invalid data"

    def test_no_msisdn(self):
        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={})
        assert response.status_code == 422
        assert response.json()["message"] == "Invalid phone number"

    def test_invalid_msisdn(self):
        invalid_numbers = ["123123123", "1231231231", "+50123123123"]
        for number in invalid_numbers:
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})
            assert response.status_code == 422
            assert response.json()["message"] == "Invalid phone number"

    def test_too_many_requests_for_ip(self):
        my_ip = requests.get("https://api.ipify.org").text

        requests_from_ip = len(self.get_registrations_entities("ip", my_ip, timedelta(hours=1)))

        for i in range(INVALID_REGS_PER_IP_LIMIT - requests_from_ip):
            number = NUMBER_PREFIX + "".join(random.choice(digits) for _ in range(9))
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": number})
            self.entities_ids_to_delete.append(response.json()["registration_id"])

        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": "+48123123123"})

        assert response.status_code == 429
        assert response.json()["message"] == "Registration temporarily not available. Try again in an hour"

    def test_too_many_requests_for_msisdn(self):
        msisdn = NUMBER_PREFIX + "".join(random.choice(digits) for _ in range(9))
        requests_for_msisdn = len(self.get_registrations_entities("msisdn", msisdn, timedelta(hours=1)))

        for _ in range(INVALID_REGS_PER_MSISDN_LIMIT - requests_for_msisdn):
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": msisdn})
            self.entities_ids_to_delete.append(response.json()["registration_id"])

        response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": msisdn})

        assert response.status_code == 429
        assert response.json()["message"] == "Registration temporarily not available. Try again in an hour"

    def test_get_pending_registration_code(self):
        requests_for_msisdn = self.get_registrations_entities("msisdn", SEND_SMS_NUMBER, timedelta(minutes=10))

        keys = []
        for _ in range(INVALID_REGS_PER_MSISDN_LIMIT - len(requests_for_msisdn)):
            response = requests.post(f"{BASE_URL}{REGISTER_ENDPOINT}", json={"msisdn": SEND_SMS_NUMBER})
            registration_id = response.json()["registration_id"]
            self.entities_ids_to_delete.append(registration_id)
            key = datastore_client.key(DATA_STORE_REGISTRATION_KIND, registration_id)
            keys.append(key)

            assert response.status_code == 200

        codes = [entity["code"] for entity in datastore_client.get_multi(keys) + requests_for_msisdn]

        assert all(code == codes[0] for code in codes)

    def get_registrations_entities(self, field: str, value: str, time_period: timedelta) -> List[Entity]:
        query = datastore_client.query(kind=DATA_STORE_REGISTRATION_KIND)
        query.add_filter(field, "=", value)
        query.add_filter("date", ">", datetime.now(tz=pytz.utc) - time_period)

        return list(query.fetch())
