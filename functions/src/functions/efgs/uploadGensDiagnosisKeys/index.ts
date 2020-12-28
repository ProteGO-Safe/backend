import {secretManager} from "../../../services";
const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessageFromEfgsMessageData from "../gensPayloadFactory";

const uploadGensDiagnosisKeys = async (dataAsBase64: string, errorHandler: Function) => {

    try {
        const appPackageName = await secretManager.getConfig('appPackageName');

        const gensPayloadMessage = createGensPayloadMessageFromEfgsMessageData(dataAsBase64, appPackageName);

        log(`uploading ${gensPayloadMessage.temporaryExposureKeys.length} keys`);

        await uploadDiagnosisKeys(gensPayloadMessage);

        log(`uploaded ${gensPayloadMessage.temporaryExposureKeys.length} keys`);
    } catch (e) {
        if (e.response && e.response.error) {
            error(e.response.error.text)
        }

        errorHandler(e);
        error('Error during uploading keys to gens');
        throw new Error(e);
    }

    log('Processed uploading keys to gens');
};

export default uploadGensDiagnosisKeys;
