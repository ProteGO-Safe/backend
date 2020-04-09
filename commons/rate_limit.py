import logging
import os
from functools import wraps

import redis
from flask import jsonify, Request

DEFAULT_LIMIT_SECOND = 10
DEFAULT_LIMIT_MINUTE = 100
DEFAULT_LIMIT_HOUR = 1000
DEFAULT_LIMIT_DAY = 5000


PERIOD_SECOND = "second"
PERIOD_MINUTE = "minute"
PERIOD_HOUR = "hour"
PERIOD_DAY = "day"

TTL_SECONDS = {
    PERIOD_SECOND: 1,
    PERIOD_MINUTE: 60,
    PERIOD_HOUR: 3600,
    PERIOD_DAY: 86400,
}

redis = redis.Redis(host=os.environ["REDIS_HOST"])


def limit_requests(
    limit_sec=DEFAULT_LIMIT_SECOND, limit_min=DEFAULT_LIMIT_MINUTE, limit_hour=DEFAULT_LIMIT_HOUR, limit_day=DEFAULT_LIMIT_DAY
):
    def decorator(func):
        @wraps(func)
        def inner(request):
            for period, limit in zip(
                (PERIOD_DAY, PERIOD_HOUR, PERIOD_MINUTE, PERIOD_SECOND,), (limit_day, limit_hour, limit_min, limit_sec)
            ):
                if not _can_request(request, func.__name__, period, limit):
                    return jsonify({"message": "Requests limit reached"}), 429
            return func(request)

        return inner

    return decorator


def _can_request(request: Request, function: str, period: str, limit: int) -> bool:
    ip = request.headers.get("X-Forwarded-For").split(",")[-1]
    key = f"{function}:{period}:{ip}"
    requests_count = redis.incr(key)
    if requests_count == 1:
        _set_ttl(key, period)
    logging.info(f"LIMITS: {period}: COUNT: {requests_count}")
    return requests_count <= limit


def _set_ttl(key: str, period: str) -> None:
    redis.expire(key, TTL_SECONDS[period])
