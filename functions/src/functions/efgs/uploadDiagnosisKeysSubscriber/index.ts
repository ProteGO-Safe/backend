import {failureUploadingDiagnosisKeysRepository} from "../../../services";
const {log} = require("firebase-functions/lib/logger");
import {v4} from "uuid";
import moment = require("moment");
import FailureUploadingDiagnosisKeys from "../../repository/FailureUploadingDiagnosisKeys";
import uploadGensDiagnosisKeys from "../uploadGensDiagnosisKeys";
import fetchErrorMessage from "../fetchErrorMessage";

const uploadDiagnosisKeysSubscriber = async (message: any) => {

    const {data: dataAsBase64} = message;

    await uploadGensDiagnosisKeys(
        dataAsBase64,
        (e: Error) => saveFailureUploadingDiagnosisKeys(dataAsBase64, e),
        () => null);
};

const saveFailureUploadingDiagnosisKeys = (dataAsBase64: string, e: Error) => {

    log(`saving failure uploading diagnosis keys`);

    const id = v4();
    const createdAt = moment().unix();
    const errorMessage = fetchErrorMessage(e);
    const stackTrace = e.stack!;

    const itemToSave = new FailureUploadingDiagnosisKeys(id, createdAt, errorMessage || '', stackTrace, dataAsBase64);

    failureUploadingDiagnosisKeysRepository.save(itemToSave);

    log(`saved failure uploading diagnosis keys, id: ${id}`);
};


export default uploadDiagnosisKeysSubscriber;
