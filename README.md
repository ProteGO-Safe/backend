#### 1. App configuration

##### Copy the configuration class:
```shell script
cp functions/src/config.example.ts functions/src/config.ts
```

##### Configure The google Secret Manager:
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
- **allowedIps** is the array of ips which allow access to the generateCode requests
- **exposureServerConfig** Auth configuration to the Exposure Notification Reference Server

##### Bucket preparation

The bucket is public CDN which is used to keep public ProteGO Safe assets.
You can use below rules configuration to make sure that only 
cloud functions will be able to write there:


```json
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
```json
    secretManagerPath: "/path/to/your/secret/object/versions/latest",
    exposureEndpoint: 'https://exposure-run.app',
    buckets: {
        cdn: 'gs://somegcs.appspot.com'
    }
```

- secretManagerPath - path to the created secret manager object
- exposureEndpoint - url to the "exposure" cloud run of the Exposure Notification Reference Server
- buckets.cdn - url to your bucket 

#### 2. Deploy cloud functions

```shell script
firebase deploy
```
