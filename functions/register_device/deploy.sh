#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} || -z ${STAGE} || -z ${PUBSUB_SEND_REGISTER_SMS_TOPIC} || -z ${INVALID_REGS_PER_IP_LIMIT} || -z ${INVALID_REGS_PER_MSISDN_LIMIT}  ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\", \"STAGE\" , \"PUBSUB_SEND_REGISTER_SMS_TOPIC\" \"INVALID_REGS_PER_IP_LIMIT\" , \"INVALID_REGS_PER_MSISDN_LIMIT\"] is not set. Exiting!"
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
    --set-env-vars STAGE=${STAGE},PUBSUB_SEND_REGISTER_SMS_TOPIC=${PUBSUB_SEND_REGISTER_SMS_TOPIC},INVALID_REGS_PER_IP_LIMIT=${INVALID_REGS_PER_IP_LIMIT},INVALID_REGS_PER_MSISDN_LIMIT=${INVALID_REGS_PER_MSISDN_LIMIT}
