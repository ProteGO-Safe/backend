#!/usr/bin/env bash

set -e

if [[ -z ${REGION} || -z ${FUNCTIONS_BUCKET} || -z ${SA_BUCKET} || -z ${SA_FILE_NAME} ]]; then
    echo
    echo "ERROR! One of variables: [\"REGION\", \"FUNCTIONS_BUCKET\", \"SA_BUCKET\", \"SA_FILE_NAME\"] is not set. Exiting!"
    echo
    exit 1
fi

gcloud functions deploy register \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated \
    --set-env-vars SA_BUCKET=${SA_BUCKET},SA_FILE_NAME=${SA_FILE_NAME}
