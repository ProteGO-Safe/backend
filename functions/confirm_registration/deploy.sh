#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} || -z ${CONFIRMATIONS_PER_MSISDN_LIMIT} ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\" \"CONFIRMATIONS_PER_MSISDN_LIMIT\"] is not set. Exiting!"
    echo
    exit 1
fi

gcloud functions deploy confirm_registration \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --entry-point confirm_registration \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated \
     --set-env-vars CONFIRMATIONS_PER_MSISDN_LIMIT=${CONFIRMATIONS_PER_MSISDN_LIMIT}

