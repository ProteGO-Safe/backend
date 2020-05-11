#### 1. Create configuration class

Copy the configuration class:
```shell script
cp functions/src/config.example.ts functions/src/config.ts
```

Next configure the Secret Manager with a new object and put there your api key: 

https://cloud.google.com/secret-manager/docs/quickstart

Set the path to the Secret Manager Object with your api key in the property `secretManagerApiTokenPath`
which is located in the config.ts file.

#### 2. Deploy cloud functions

```shell script
firebase deploy
```
