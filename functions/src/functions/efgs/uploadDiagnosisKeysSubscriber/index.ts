import config, {secretManager} from "../../../config";

const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";
import * as admin from "firebase-admin";
import {v4} from "uuid";
import moment = require("moment");

const parseJson = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    return JSON.parse(data);
};

const convertMessage = async (efgsData: any) => {

    const appPackageName = await secretManager.getConfig('appPackageName');

    return {
        ...createGensPayloadMessage(efgsData.keysData),
        regions: config.efgs.gens.regions,
        appPackageName,
        platform: config.efgs.gens.platform
    }
};

const fetchErrorMessage = (e: any) => {
    if (e.response && e.response.error) {
        return e.response.error.text
    }
    return undefined;
};

const uploadDiagnosisKeysSubscriber = async (message: any) => {

    const {data} = message;

    try {
        const efgsData = parseJson(data);
        const gensPayloadMessage = await convertMessage(efgsData);

        log(`uploading ${gensPayloadMessage.temporaryExposureKeys.length} keys from batchTag ${efgsData.batchTag}`);

        await uploadDiagnosisKeys(gensPayloadMessage);

        log(`uploaded ${gensPayloadMessage.temporaryExposureKeys.length} keys`);
    } catch (e) {
        if (e.response && e.response.error) {
            error(e.response.error.text)
        }

        saveFailureUploadingDiagnosisKeys(data, e);
        throw new Error(e);
    }

    log('Processed uploading keys to gens');
};

const firestoreCollectionName = "failedUploadingToGensDiagnosisKeys";

const saveFailureUploadingDiagnosisKeys = (data: string, e: Error) => {

    const db = admin.firestore();
    const id = v4();
    const createdAt = moment().unix();
    const errorMessage = fetchErrorMessage(e);
    const itemToSave = {id, content: data, createdAt, stackTrace: e.stack, errorMessage: errorMessage || ''};
    db.collection(firestoreCollectionName)
        .doc(id)
        .set(itemToSave)
        .catch(reason => {
            throw new Error(reason)
        });
};


export default uploadDiagnosisKeysSubscriber;
