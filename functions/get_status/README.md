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
method: GET
```

```
curl ${URL}
{
    "beacon_ids": [
        {
           "beacon_id": "8d672642-7046-11ea-8e40-3f45fb5912b4", 
            "date":"2020032716"
        }
    ],
    "status":"orange"
}
```

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored


Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
./deploy.sh
```

or directly by `gcloud`:
```bash
gcloud functions deploy get_status \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated
```
