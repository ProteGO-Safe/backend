# Register device endpoint

### Example calls to endpoint

#### Prerequisites:
```bash
REGION=europe-west3
PROJECT_ID=<project_id>
URL=https://${REGION}-${PROJECT_ID}.cloudfunctions.net/register_device_${STAGE}
```

#### Request details:
```
method: POST
content-type: Application/json
params: msisdn
msisdn has to start with +48
```

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `STAGE` - DEVELOPMENT or PRODUCTION
* `PUBSUB_SEND_REGISTER_SMS_TOPIC` - send_register_sms_topic
* `INVALID_REGS_PER_MSISDN_LIMIT` - request limit per msisdn per hour
* `INVALID_REGS_PER_IP_LIMIT` - request limit per ip per hour


Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
STAGE=DEVELOPMENT \
PUBSUB_SEND_REGISTER_SMS_TOPIC=send_register_sms_topic \
INVALID_REGS_PER_MSISDN_LIMIT=4 \
INVALID_REGS_PER_IP_LIMIT=10 \
./deploy.sh
```

