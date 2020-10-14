import {verify} from "jsonwebtoken";
import config, {secretManager} from "../../config";
import * as functions from "firebase-functions";

const {log} = require("firebase-functions/lib/logger");
import {v4} from "uuid";
import * as admin from "firebase-admin";
import uploadDiagnosisKeys from "../uploadDiagnosisKeys";

export async function uploadDiagnosisKeysHttpHandler(request: functions.Request, response: functions.Response) {
    const body = request.body;
    if (!await auth(body.data.verificationPayload)) {
        return response.status(401).send({error: {message: "", status: "UNAUTHENTICATED"}});
    }

    try {
        await uploadDiagnosisKeys(body.data)
            .then((ignore: any) => saveDiagnosisKeys(body))
    } catch (error) {
        if (error.response && error.response.error) {
            return response.status(error.response.error.status).send(JSON.parse(error.response.error.text));
        }
    }

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

export const saveDiagnosisKeys = (body: any) => {
    const {isInteroperabilityEnabled} = body;
    if (!isInteroperabilityEnabled) {
        return;
    }
    const id = v4();
    const db = admin.firestore();
    const itemToSave = {id, ...body};
    log(`saving diagnosis keys on firestore: `, itemToSave);
    db.collection(config.efgs.firestore.diagnosisKeysCollectionName)
        .doc(id)
        .set(itemToSave)
        .catch(reason => {
            throw new Error(reason)
        });
};


export default uploadDiagnosisKeysHttpHandler;
