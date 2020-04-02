# Get status endpoint

### Example calls to endpoint

#### Prerequisites:

```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/send_encounters
```

#### Request details:
```
method: POST
content-type: Application/json
params:
user_id
platform
os_version
device_name
app_version
lang
encounters

curl -X POST ${URL} -d '{"user_id": "user-id", "platform": "PLATFORM", "os_version": 0.0, "device_name": "NAME", "app_version": 0.0, "lang": "PL", "encounters": [{"beacon_id": "beacon_id", "encounter_date":"encounter_date", "signal_strength": "signal_strength"}]}'
{
    "status":"OK"
}
```

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
