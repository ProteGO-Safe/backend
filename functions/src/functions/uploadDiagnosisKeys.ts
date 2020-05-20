import {CallableContext} from "firebase-functions/lib/providers/https";
import * as admin from "firebase-admin";
import {verify} from "jsonwebtoken";
import config from "../config";
import {v4} from "uuid";
import * as path from "path";
import * as functions from "firebase-functions";

export async function uploadDiagnosisKeys(data : any, context: CallableContext) {
    if (!await auth(data.verificationPayload)) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid access token');
    }

    const file = admin.storage().bucket(config.bucket).file(path.join('diagnosis-keys', v4()));
    await file.save(JSON.stringify(data), {contentType: 'application/json'})

    return [];
}

async function auth(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false;
    }

    try {
        verify(token, await config.secretManager.getConfig('secret'), {algorithms: ["HS512"]});
    } catch (e) {
        return false;
    }

    return true;
}

export default uploadDiagnosisKeys;
