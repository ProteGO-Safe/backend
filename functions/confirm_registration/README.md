# Register device endpoint

### Example calls to endpoint

#### Prerequisites:
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
* `CONFIRMATIONS_PER_MSISDN_LIMIT` - confirmations_per_msisdn_limit


Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
CONFIRMATIONS_PER_MSISDN_LIMIT=3 \
./deploy.sh
```
