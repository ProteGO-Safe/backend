const {log, error} = require("firebase-functions/lib/logger");
import {verify} from "jsonwebtoken";
import {secretManager, hashedAccessTokensRepository} from "../../services";
import * as functions from "firebase-functions";
const {PubSub} = require('@google-cloud/pubsub');

import {v4} from "uuid";
import * as admin from "firebase-admin";
import uploadDiagnosisKeys from "../uploadDiagnosisKeys";
import config from "../../config";
import moment = require("moment");

const pubsub = new PubSub();

export async function uploadDiagnosisKeysHttpHandler(request: functions.Request, response: functions.Response) {
    const body = request.body;
    if (!await auth(body.data.verificationPayload)) {
        return response.status(401).send({error: {message: "", status: "UNAUTHENTICATED"}});
    }
    const {isInteroperabilityEnabled, data: {temporaryExposureKeys}} = body;
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

    await hashedAccessTokensRepository.save(body.data.verificationPayload)
        .catch(reason => {
            log("Failed to store hashed access token " + reason)
        });

    await trackUploadedKeys(temporaryExposureKeys.length, isInteroperabilityEnabled);

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

    const hashedToken = await hashedAccessTokensRepository.get(token);

    return !hashedToken.exists;
}

const firestoreCollectionName = "diagnosisKeys";

export const saveDiagnosisKeys = (body: any) => {
    const {isInteroperabilityEnabled, data: {temporaryExposureKeys}} = body;

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

const trackUploadedKeys = async (temporaryExposureKeysLength: number, isInteroperabilityEnabled: boolean) => {
    const topic = pubsub.topic(config.metrics.uploadedKeyMetricTopicName);
    const message = {
        temporaryExposureKeysLength,
        isInteroperabilityEnabled,
    };
    const messageBuffer = Buffer.from(JSON.stringify(message), 'utf8');

    await topic.publish(messageBuffer).catch((reason: any) => {
        error(`Failed to send tracked data: ${reason}`)
    });
};

export default uploadDiagnosisKeysHttpHandler;
