#### 1. Create configuration class

Copy the configuration class:
```shell script
cp functions/src/config.example.ts functions/src/config.ts
```

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
 


Set the path to the Secret Manager Object in the property `secretManagerPath` (inside config.ts file)

#### 2. Deploy cloud functions

```shell script
firebase deploy
```
