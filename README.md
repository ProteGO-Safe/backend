---
description: Nginx proxy for https://api.infermedica.com
keywords: nginx, proxy, infermedica, safesafe, tls, alpine, docker, swarm, advanced
title: API proxy using Nginx, Docker, Swarm, LetsEncrypt and CloudFlare
location:
- https://api.safesafe.app
---

# Use-case

We use Nginx as a proxy for Infermedica API requests from our PWA to make it more secure and private for end users.

### Alternatives

If you don't like our proxy but still want to test the API yourself we are happy to inform it's public. Maintenance of developer access is done separately from this project though and you should visit https://developer.infermedica.com for more information.

# Solution

With the method presented here, you implement proxy that sits in front of Infermedica's API that everyone can use in a secure and transparent fashion.

While we use..

We also implement..

We also use .. for..

# Environment

FOR THE PURPUSE OF **DEVELOPMENT ENVIRONMENT** PORTABILITY AS WELL AS LOW ENTRY LEVEL FOR OUR COMMUNITY USERS WE USED DOCKER ENGINE AS OUR EXAMPLE DEPLOYMENT ORCHESTRATOR. BELOW EXAMPLE EVEN THOUGH PASSED WITH THE BEST PRACTICES IN MIND IS MEANT FOR **DEVELOPMENT USE ONLY**.

Provided manual give instructions for `docker build`, `stack`, `service` and `secret` commands so please install [Docker Engine](https://docs.docker.com/get-docker/) and make sure [Docker Swarm](https://docs.docker.com/engine/reference/commandline/swarm_init/) is up and running beforehand.

## Cloning and building

Clone this github repository:

```sh
git clone https://github.com/ProteGO-Safe/backend
```

Change working directory:

```sh
cd backend
```

Build local image:

```sh
docker build -t infermedica-nginx-proxy:stable-alpine -f Dockerfile .
```

## Required Credentials

As we mentioned in [Use-Case](#Use-Case) section you need Infermedica's credentials to authenticate to their API server. We also use TLSv1.2 certificates with cloudflare as our CA and suggest everyone to do the same thing using for example [certbot-dns-cloudflare](https://certbot-dns-cloudflare.readthedocs.io/en/stable/) for security by default approach. There is also an official [docker image](https://hub.docker.com/r/certbot/dns-cloudflare) for simplyfing this even further and we'll use it in this process. So after obtaining Infermedica's `App-Id` and `App-Key` by registring at https://developer.infermedica.com, only thing you need is cloudflare's API credentials which you can gather from your [account page](https://dash.cloudflare.com/profile/api-tokens).

After obtaining appropriate credentials pass them to your secret env files (disabling history for the time being - again for the sake of security):

```sh
set +o history
sudo mkdir -p \
/etc/letsencrypt \
/var/lib/letsencrypt \
$(pwd)/.env

# You can extend this using Lua for variable interpolation in nginx config files but it'll do for tests.
sed -i 's/server_name api.example.domain/server_name api."<your domain>"/g' $(pwd)/nginx/conf.d/api.safesafe.app.conf
sed -i 's/App-Id  "secret"/App-Id  "<your app id>"/g' $(pwd)/nginx/conf.d/api.safesafe.app.conf
sed -i 's/App-Key "secret"/App-Key "<your app key>"/g' $(pwd)/nginx/conf.d/api.safesafe.app.conf
chmod 0600 $(pwd)nginx/conf.d/api.safesafe.app.conf
echo 'dns_cloudflare_email = <your_dns_cloudflare_email>' > $(pwd)/.env/.cf-env
echo 'dns_cloudflare_api_key = <your_dns_cloudflare_api_key>' >> $(pwd)/.env/.cf-env
```

Then create certificates using docker and provided mount paths:

```sh
docker run --rm -it --name certbot \
--mount type=bind,source=/etc/letsencrypt,target=/etc/letsencrypt \
--mount type=bind,source=/var/lib/letsencrypt,target=/var/lib/letsencrypt \
--mount type=bind,source=$(pwd)/.env,target=/etc/.env \
certbot/dns-cloudflare certbotonly \
--dns-cloudflare-credentials=/etc/.env/.cf-env

# this might take a while but what is time compared to security
openssl dhparam -out `$(pwd)/.certs/dhparam.pem` 4096

# cleanup and re-enable history
mv /etc/letsencrypt/* $(pwd)/.certs/
chmod 0600 $(pwd)/.env/.*
chmod 0600 $(pwd)/.certs/*
rm -rf /etc/letsencrypt /var/lib/letsencrypt
set -o history
```

All sensitive files should be stored under `.certs` or `.env` directories each of which are ofcourse excluded from versioning in `.gitignore` and from passing to the build context in `.dockerignore` for obviuos reasons.

## Deploy

Now, that local Docker Image is ready and all the secrets are in place, we can control the service using Docker CLI providing default docker-compose.yml configuration file located in the root of this repository.

```sh
docker stack deploy -c docker-compose.yml im-api
```

## Test

You can test Infermedica'a API with this proxy using for example cURL:

```sh
curl -X GET https://api.<your domain>/v2/info
{"updated_at":"2020-04-07T15:00:00Z","conditions_count":668,"symptoms_count":1250,"risk_factors_count":128,"lab_tests_count":486}
```

## Destroy

Done testing your API proxy? Don't forget to destroy the service.

```sh
docker stack rm im-api
```

# License

Licensed under GNU AFFERO GENERAL PUBLIC LICENSE, Version 3 (the "License");  
You may not use this file except in compliance with the License.  
You may obtain a copy of the License at

    https://www.gnu.org/licenses/agpl-3.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Trademarks
Nginx, Docker, Swarm, LetsEncrypt, CloudFlare and Infermedica - All trademarks are the property of their respective owners.
