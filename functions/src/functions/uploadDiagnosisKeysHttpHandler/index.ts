const {log} = require("firebase-functions/lib/logger");
import {verify} from "jsonwebtoken";
import {secretManager} from "../../services";
import * as functions from "firebase-functions";

import {v4} from "uuid";
import * as admin from "firebase-admin";
import moment = require("moment");
import uploadDiagnosisKeys from "../uploadDiagnosisKeys";

export async function uploadDiagnosisKeysHttpHandler(request: functions.Request, response: functions.Response) {
    const body = request.body;
    if (!await auth(body.data.verificationPayload)) {
        return response.status(401).send({error: {message: "", status: "UNAUTHENTICATED"}});
    }
    const { isInteroperabilityEnabled, data : {temporaryExposureKeys} } = body;
    try {
        await uploadDiagnosisKeys(body.data)
            .then((ignore: any) => saveDiagnosisKeys(body))
    } catch (error) {
        if (error.response && error.response.error) {
            log(`failed uploading keys from user to gens, keys: ${temporaryExposureKeys.length}, return code: ${error.response.error.status}, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`);
            return response.status(error.response.error.status).send(JSON.parse(error.response.error.text));
        }
    }

    log(`uploaded keys from user to gens, keys: ${temporaryExposureKeys.length}, return code: 200, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`);

    return response.status(200).send({result: ""});
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

const firestoreCollectionName = "diagnosisKeys";

export const saveDiagnosisKeys = (body: any) => {
    const { isInteroperabilityEnabled, data : {temporaryExposureKeys} } = body;
    if (!isInteroperabilityEnabled) {
        return;
    }

    const db = admin.firestore();
    temporaryExposureKeys.forEach((exposureKey: any) => {
        const id = v4();
        const createdAt = moment().unix();
        const itemToSave = {id, createdAt, ...exposureKey};
        db.collection(firestoreCollectionName)
            .doc(id)
            .set(itemToSave)
            .catch(reason => {
                throw new Error(reason)
            });
    });
};


export default uploadDiagnosisKeysHttpHandler;
