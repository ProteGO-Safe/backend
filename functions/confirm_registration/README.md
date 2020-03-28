# Register device endpoint

### Example calls to endpoint

#### Perequisites:
```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/confirm_registration
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
