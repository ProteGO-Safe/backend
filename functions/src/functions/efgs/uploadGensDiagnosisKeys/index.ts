import {secretManager} from "../../../services";
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessageFromEfgsMessageData from "../gensPayloadFactory";
import errorLogger from "../../logger/errorLogger";
import errorEntryLabels from "../../logger/errorEntryLabels";

const {log} = require("firebase-functions/lib/logger");

const uploadGensDiagnosisKeys = async (dataAsBase64: string, errorHandler: Function) => {

    try {
        const appPackageName = await secretManager.getConfig('appPackageName');

        const gensPayloadMessage = createGensPayloadMessageFromEfgsMessageData(dataAsBase64, appPackageName);

        log(`uploading ${gensPayloadMessage.temporaryExposureKeys.length} keys`);

        await uploadDiagnosisKeys(gensPayloadMessage);

        log(`uploaded ${gensPayloadMessage.temporaryExposureKeys.length} keys`);
    } catch (e) {
        if (e.response && e.response.error) {
            errorLogger.error(errorEntryLabels(e.response.error.text), e.response.error.text);
        }

        errorHandler(e);
        const errorMessage = 'Error during uploading keys to gens';
        errorLogger.error(errorEntryLabels(errorMessage), errorMessage);

        throw new Error(e);
    }

    log('Processed uploading keys to gens');
};

export default uploadGensDiagnosisKeys;
