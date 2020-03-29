# Send register sms endpoint

#### Prerequisites:

```bash
REGION=europe-west3
PROJECT_ID=<project_id>
SMS_API_TOKEN=<SMS_API_TOKEN>
PUBSUB_SEND_REGISTER_SMS_TOPIC=<PUBSUB_SEND_REGISTER_SMS_TOPIC>
```


#### Running:
Triggered by PubSub topic: send_register_sms_topic

### Deployment

Required variables to deploy function:
* `PROJECT_ID` - GCP project ID
* `REGION` - region of the GCP project
* `FUNCTIONS_BUCKET` - bucket where functions are stored
* `SMS_API_TOKEN` - token for sms api
* `PUBSUB_SEND_REGISTER_SMS_TOPIC` - send register sms PubSub topic


Example deploy function (you have to be authorized to gcloud):
```bash
REGION=europe-west3 \
PROJECT_ID=<project_id> \
FUNCTIONS_BUCKET=${PROJECT_ID}-functions \
SMS_API_TOKEN=<SMS_API_TOKEN> \
PUBSUB_SEND_REGISTER_SMS_TOPIC=<PUBSUB_SEND_REGISTER_SMS_TOPIC> \
./deploy.sh
```
