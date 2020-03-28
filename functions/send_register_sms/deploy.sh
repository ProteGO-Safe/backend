#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} || -z ${SMS_API_TOKEN} || -z ${SEND_REGISTER_SMS_TOPIC} ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\", \"SMS_API_TOKEN\" , \"SEND_REGISTER_SMS_TOPIC\" ] is not set. Exiting!"
    echo
    exit 1
fi

gcloud functions deploy send_register_sms \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --allow-unauthenticated \
    --trigger-topic=$SEND_REGISTER_SMS_TOPIC \
    --set-env-vars SMS_API_TOKEN=${SMS_API_TOKEN}

