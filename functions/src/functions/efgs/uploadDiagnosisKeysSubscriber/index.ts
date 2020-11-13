import config from "../../../config";

const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";
import * as admin from "firebase-admin";
import {v4} from "uuid";
import moment = require("moment");

const convertMessage = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    const efgsData = JSON.parse(data);
    return {
        ...createGensPayloadMessage(efgsData.keysData),
        regions: config.efgs.gens.regions,
        appPackageName: config.efgs.gens.appPackageName,
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
        const gensPayloadMessage = convertMessage(data);

        log(`uploading ${gensPayloadMessage.temporaryExposureKeys.length} keys`);

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

const saveFailureUploadingDiagnosisKeys = (data: string, e: Error) => {

    const db = admin.firestore();
    const id = v4();
    const createdAt = moment().unix();
    const errorMessage = fetchErrorMessage(e);
    const itemToSave = {id, content: data, createdAt, stackTrace: e.stack, errorMessage: errorMessage || ''};
    db.collection(config.efgs.firestore.failedUploadingToGensDiagnosisKeysCollectionName)
        .doc(id)
        .set(itemToSave)
        .catch(reason => {
            throw new Error(reason)
        });
};


export default uploadDiagnosisKeysSubscriber;
