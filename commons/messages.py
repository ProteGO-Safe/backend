import json

MESSAGE_INVALID_DATA = "invalid_data"
MESSAGE_REGISTRATION_EXPIRED = "registration_expired"
MESSAGE_MISSING_FIELD = "missing_field"
MESSAGE_UNAUTHORIZED = "unauthorized"
MESSAGE_INVALID_PHONE_NUMBER = "invalid_phone_number"
MESSAGE_REGISTRATION_NOT_AVAILABLE = "registration_not_available"
MESSAGE_INTERNAL_SERVER_ERROR = "internal_server_error"

with open("messages.json") as file:
    MESSAGES = json.load(file)


def get_message(message_code: str, lang: str) -> str:
    return MESSAGES[message_code][lang]
