#### 1. App configuration

##### Copy the configuration class:
```shell script
cp functions/src/config.example.ts functions/src/config.ts
```

##### Configure The google Secret Manaer:
Next, configure the Google Secret Manager of your project with a new object and put there filled json: 

```json
{
  "apiToken": "",
  "secret": "",
  "allowedIPs": []
}
```
- **apiToken** is the token which has to be included in the header of the generateCode requests
- **secret** is the JWT secret
- **allowedIps** is the array of ips which allow access to the generateCode requests

##### Prepare storage buckets:

You have to create two buckets.

First bucket will be used for temporary keeping uploaded diagnosis keys. 
You can use below rules configuration to make sure that 
only cloud functions will be able to write and read from it

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```


Second bucket is public CDN which is used to keep public ProteGO Safe assets
You can use below rules configuration to make sure that only 
cloud functions will be able to write


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
    buckets: {
        diagnosisKeys: 'gs://your-temporary-diagnosis-keys-bucket',
        cdn: 'gs://your-cdn-bucket'
    },
```

#### 2. Deploy cloud functions

```shell script
firebase deploy
```
