import {sign, verify} from "jsonwebtoken";
import config, {secretManager} from "../config";
import * as functions from "firebase-functions";
import Axios from "axios";
const superagent = require('superagent');
import {saveDiagnosisKeys} from "./efgs/efgsStorageManager/efgsStorageManager";

export async function uploadDiagnosisKeys(request : functions.Request, response : functions.Response) {
    const body = request.body;

    if (!await auth(body.data.verificationPayload)) {
        return response.status(401).send({error: {message: "", status: "UNAUTHENTICATED"}});
    }

    const idToken = await getIdToken();

    try {
        superagent
            .post(config.exposureEndpoint)
            .send(body.data)
            .set('Authorization', `Bearer ${idToken}`)
            .then((ignore: any) => saveDiagnosisKeys(body))
    } catch (error) {
        if (error.response && error.response.error) {
            return response.status(error.response.error.status).send(JSON.parse(error.response.error.text));
        }
    }

    return response.status(200).send({result:""});
}

async function auth(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false;
    }

    try {
        verify(token, await secretManager.getConfig('secret'), {algorithms: ["HS512"]});
    } catch (e) {
        return false;
    }

    return true;
}

async function getIdToken(): Promise<string> {
    const serverConfig = await secretManager.getConfig('exposureServerConfig');

    const jwt = sign(
        {
            target_audience: config.exposureEndpoint
        },
        <string> serverConfig.private_key,
        {
            algorithm: 'RS256',
            expiresIn: '60 minutes',
            audience: serverConfig.token_uri,
            issuer: serverConfig.client_email
        }
    );

    const response = await Axios.post(serverConfig.token_uri, {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
    });

    return <string>response.data.id_token;
}

export default uploadDiagnosisKeys;
