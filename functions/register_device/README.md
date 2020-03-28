# Register device endpoint

### Example calls to endpoint

#### Prerequisites:
```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/register_device
```

#### Request details:
```
method: POST
content-type: Application/json
params: phone_no
phone_no has to start with +48
```

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `STAGE` - DEVELOPMENT or PRODUCTION


Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
STAGE=DEVELOPMENT \
./deploy.sh
```

or directly by `gcloud`:
```bash
gcloud functions deploy register_device \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated \
    --set-env-vars STAGE=${STAGE}

```
