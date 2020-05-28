import {CallableContext} from "firebase-functions/lib/providers/https";
import {sign, verify} from "jsonwebtoken";
import config, {secretManager} from "../config";
import * as functions from "firebase-functions";
import Axios from "axios";

export async function uploadDiagnosisKeys(data : any) {
    if (!await auth(data.verificationPayload)) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid access token');
    }

    const idToken = await getIdToken();

    await Axios.post(config.exposureEndpoint, data, {
        headers: { Authorization: `Bearer ${idToken}` }
    });

    return [];
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
