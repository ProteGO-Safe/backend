# Check version endpoint

### Example calls to endpoint

#### Prerequisites:

```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/check_version
```

#### Request details:
```
method: GET
```

```
curl ${URL}
{"upgrade_required":false,"upgrade_url":""}
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
gcloud functions deploy register_device \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated
```
