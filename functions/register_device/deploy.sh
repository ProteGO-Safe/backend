#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} || -z ${STAGE} || -z ${PUBSUB_SEND_REGISTER_SMS_TOPIC} ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\", \"STAGE\" , \"PUBSUB_SEND_REGISTER_SMS_TOPIC\"] is not set. Exiting!"
    echo
    exit 1
fi

gcloud functions deploy register_device_${STAGE} \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated \
    --entry-point register_device \
    --set-env-vars STAGE=${STAGE},PUBSUB_SEND_REGISTER_SMS_TOPIC=${PUBSUB_SEND_REGISTER_SMS_TOPIC}
