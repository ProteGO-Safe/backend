# Send Encounters endpoint

### Example calls to endpoint

[Swagger](https://swagger.io/) file is available [here](../../docs/swagger.yaml). 

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `BQ_TABLE` - name of the BigQuery

Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
BQ_TABLE=<table-name> \
./deploy.sh
```

or directly by `gcloud`:
```bash
gcloud functions deploy send_encounters \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --set-env-vars BQ_DATASET=${BQ_DATASET},BQ_TABLE=${BQ_TABLE} \
    --trigger-http --allow-unauthenticated
```
