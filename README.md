
# System tests:
In order to run test you need to set environment variables:

`STAGE` - DEVELOPMENT or PRODUCTION

`SEND_SMS_NUMBER` - 9 digit - requiered only in case of PRODUCTION

`GOOGLE_APPLICATION_CREDENTIALS` - path to account credentials file

Install requirements from `tests/requirements.txt`

Run:
```shell script
python -m  unittest
```

In case of PRODUCTION you should receive SMS on number given

