# Get status endpoint

### Example calls to endpoint

#### Prerequisites:

```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/get_status
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

curl -X POST ${URL} -d '{"user_id": "user-id", "platform": "PLATFORM", "os_version": 0.0, "device_name": "NAME", "app_version": 0.0, "lang": "PL"}'
{
    "status":"orange"
    "beacon_ids": [
        {
           "beacon_id": "3982a27de2d8166b3c1588e7be560b11", 
            "date":"2020032716"
        },
        [...]
    ],
}
```

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `BQ_TABLE` - full path to BigQuery table in form `<PROJECT>.<DATASET>.<TABLE_NAME>`

Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
BQ_DATASET=<dataset-name> \
BQ_TABLE=<table-name> \
./deploy.sh
```

or directly by `gcloud`:
```bash
gcloud functions deploy get_status \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --set-env-vars BQ_DATASET=${BQ_DATASET},BQ_TABLE=${BQ_TABLE} \
    --trigger-http --allow-unauthenticated
```
