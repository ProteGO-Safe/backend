# Register endpoint

### Example calls to endpoint

#### Perequisites:
```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/register
```

#### Successfull call:
```
curl -d 'DOCTOR_ID=1' -X POST ${URL}
{
    "credentials": {
        ...
    }
}
```

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `SA_BUCKET` - bucket where credentials for writing to files source bucket are stored.
* `SA_FILE_NAME` - path to credentials file on the bucket

Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
SA_BUCKET=${PROJECT_ID}-secrets-source \
SA_FILE_NAME=write-to-files-source-sa/sa.json \
bash deploy.sh
```

or directly by `gcloud`:
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
SA_BUCKET=${PROJECT_ID}-secrets-source \
SA_FILE_NAME=write-to-files-source-sa/sa.json \
gcloud functions deploy register \
    --region=${REGION} \
    --source=./ \
    --runtime=python37 \
    --stage-bucket=${FUNCTIONS_BUCKET} \
    --trigger-http --allow-unauthenticated \
    --set-env-vars SA_BUCKET=${SA_BUCKET},SA_FILE_NAME=${SA_FILE_NAME}
```
