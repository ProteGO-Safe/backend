#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\"] is not set. Exiting!"
    echo
    exit 1
fi

gcloud functions deploy get_status \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --set-env-vars BQ_DATASET=${BQ_DATASET},BQ_TABLE=${BQ_TABLE} \
    --trigger-http --allow-unauthenticated
