![STOP COVID - ProteGO Safe](./doc/img/baner.jpg "STOP COVID - ProteGO Safe")

## General info

Cloud Functions for the STOP COVID - ProteGO Safe application.

List of Cloud Functions:

- **generateCode** - generating pin codes
- **getAccessToken** - exchanging pin codes for access tokens
- **uploadDiagnosisKeys** - uploading temporary exposure keys
- **clearUnusedCodes** - clearing expired pin codes 
- **faqParser** - parsing the government FAQ page
- **advicesParser** - parsing the government advices page
- **hospitalsParser** - parsing the government hospitals page
- **backupTranslations** - backup translation's files


## Configuration

##### Copy the configuration class:
```shell script
cp functions/src/config.example.ts functions/src/config.ts
```

##### Configure The Google Secret Manager:
You have to configure the Google Secret Manager of your project with a new object and put there filled json: 

```json
{
  "apiToken": "",
  "secret": "",
  "allowedIPs": [],
  "exposureServerConfig": {}
}
```
- **apiToken** is the token which has to be included in the header of the generateCode requests
- **secret** is the JWT secret
- **allowedIps** is the array of (health authority) ips which allow access to the generateCode requests
- **exposureServerConfig** Auth configuration to the Exposure Notification Reference Server

##### Bucket preparation

The bucket is public CDN which is used to keep public STOP COVID - ProteGO Safe assets.
You can use below rules configuration to make sure that only 
cloud functions will be able to write there:


```text
rules_version = '2';
service firebase.storage {
  // Anyone can read from the bucket.
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
    }
  }
  // Only CF can write to the bucket.
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if false;
    }
  }
}
```

##### Set values of your config.ts file:
```text
    secretManagerPath: "/path/to/your/secret/object/versions/latest",
    exposureEndpoint: 'https://exposure-run.app',
    buckets: {
        cdn: 'gs://somegcs.appspot.com',
        archive: 'gs://somegcs'
    }
```

- secretManagerPath - path to the created secret manager object
- exposureEndpoint - url to the "exposure" cloud run of the Exposure Notification Reference Server
- buckets.cdn - url to your bucket 
- buckets.archive - url to your archive bucket 

## Cloud Functions deployment

You have to configure the [Firebase CLI](https://firebase.google.com/docs/cli) and run this command:

```shell script
firebase deploy
```
## Versioning

Please check the changelog: [CHANGELOG.md](CHANGELOG.md)

## Running function locally
- at the end on the function add execute them, for example:
```shell script
const someFunction = async () => {
 // body
}
export default someFunction;

someFunction()

```
- run docker container from ./docker/docker-compose.yml
- exec with bash
- to authorization first generate service account key at https://console.cloud.google.com/apis/credentials/serviceaccountkey, store it in root of project, next execute export GOOGLE_APPLICATION_CREDENTIALS="/app/path/to/file.json"
- execute npx ts-node /app/functions/src/functions/someFunction.ts

## Generating certification's files

Please check the following: [CERTIFICATIONS.md](./doc/certifications.md)