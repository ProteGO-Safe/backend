import {failureUploadingDiagnosisKeysRepository} from "../../../services";
const {log} = require("firebase-functions/lib/logger");
import moment = require("moment");
import config from "../../../config";
import uploadGensDiagnosisKeys from "../uploadGensDiagnosisKeys";
import FailureUploadingDiagnosisKeys from "../../repository/FailureUploadingDiagnosisKeys";
import fetchErrorMessage from "../fetchErrorMessage";


const uploadFailedDiagnosisKeysToGENS = async () => {

    const failureUploadingDiagnosisKeys = await failureUploadingDiagnosisKeysRepository.listLimitedOrderByDate(config.efgs.failedGens.limit);

    for (const failureUploadingDiagnosisKey of failureUploadingDiagnosisKeys) {
        const {dataAsBase64, tries, id} = failureUploadingDiagnosisKey;
        log(`trying send failed keys to gens, id: ${id}, tries: ${tries}`);
        await uploadGensDiagnosisKeys(dataAsBase64, (e : Error) => saveFailureAgainUploadingDiagnosisKeys(dataAsBase64, e, failureUploadingDiagnosisKey));

    }
};

const saveFailureAgainUploadingDiagnosisKeys = (dataAsBase64: string, e: Error, failureUploadingDiagnosisKey: FailureUploadingDiagnosisKeys) => {

    const {id, tries = 0} = failureUploadingDiagnosisKey;

    if (tries >= config.efgs.failedGens.retries) {
        log(`maximum tried occurred, removing, id: ${id}, tries: ${tries}`);
        failureUploadingDiagnosisKeysRepository.delete(id);
        log(`removed failed keys, id: ${id}`);
    } else {
        log(`saving failure uploading diagnosis keys, id: ${id}, tries: ${tries}`);
        const createdAt = moment().unix();
        const errorMessage = fetchErrorMessage(e);
        const stackTrace = e.stack!;

        const itemToSave = new FailureUploadingDiagnosisKeys(id, createdAt, errorMessage || '', stackTrace, dataAsBase64, tries + 1);

        failureUploadingDiagnosisKeysRepository.save(itemToSave);

        log(`saved failure uploading diagnosis keys, id: ${id}, tries: ${tries}`);
    }
};


export default uploadFailedDiagnosisKeysToGENS;
