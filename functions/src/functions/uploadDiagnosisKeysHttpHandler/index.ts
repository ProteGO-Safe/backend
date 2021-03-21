import errorLogger from "../logger/errorLogger";
import {verify} from "jsonwebtoken";
import {hashedAccessTokensRepository, secretManager} from "../../services";
import * as functions from "firebase-functions";
import {v4} from "uuid";
import * as admin from "firebase-admin";
import uploadDiagnosisKeys from "../uploadDiagnosisKeys";
import config from "../../config";
import errorEntryLabels from "../logger/errorEntryLabels";

const {log} = require("firebase-functions/lib/logger");
const {PubSub} = require('@google-cloud/pubsub');

import moment = require("moment");

const pubsub = new PubSub();

const parseErrorText = (errorText: string): any => {
    try {
        return JSON.parse(errorText)
    } catch (e) {
        return ''
    }
};

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
            const errorMessage = `failed uploading keys from user to gens, keys: ${temporaryExposureKeys.length}, return code: ${error.response.error.status}, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`;
            errorLogger.error(errorEntryLabels(errorMessage), errorMessage);

            return response.status(error.response.error.status).send(parseErrorText(error.response.error.text));
        } else {
            return response.status(error.response.status).send({result: ""});
        }
    }

    log(`uploaded keys from user to gens, keys: ${temporaryExposureKeys.length}, return code: 200, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`);

    await hashedAccessTokensRepository.save(body.data.verificationPayload)
        .catch(reason => {
            const message = `Failed to store hashed access token ${reason}`;
            errorLogger.error(errorEntryLabels(message), message);
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
        const errorMessage = `Failed to send tracked data: ${reason}`;
        errorLogger.error(errorEntryLabels(errorMessage), errorMessage);
    });
};

export default uploadDiagnosisKeysHttpHandler;
