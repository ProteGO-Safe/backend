# Confirm registration endpoint

### Example calls to endpoint

[Swagger](https://swagger.io/) file is available [here](../../docs/swagger.yaml). 

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
