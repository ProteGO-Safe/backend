import config from "../../../config";

const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";

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

const uploadDiagnosisKeysSubscriber = async (message: any) => {

    const data = convertMessage(message.data);

    try {
        log(`uploading ${data.temporaryExposureKeys.length} keys`);

        await uploadDiagnosisKeys(data);

        log(`uploaded ${data.temporaryExposureKeys.length} keys`);
    } catch (e) {
        if (e.response && e.response.error) {
            error(e.response.error.text)
        }
        throw new Error(e);
    }

    log('Processed uploading keys to gens');
};

export default uploadDiagnosisKeysSubscriber;
