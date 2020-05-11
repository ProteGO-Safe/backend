import {CallableContext} from "firebase-functions/lib/providers/https";
import config from "../config";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import moment = require("moment");

export async function uploadDiagnosisKeys(data : any, context: CallableContext) {
    const repository = config.code.repository;

    const code = await repository.get(data.code);

    if (!code.exists) {
        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    await repository.remove(data.code);

    await admin.firestore().collection('diagnosisKeys').add({
        time: moment().unix(),
        diagnosisKeys: data.diagnosisKeys ? data.diagnosisKeys : []
    });
}

export default uploadDiagnosisKeys;
