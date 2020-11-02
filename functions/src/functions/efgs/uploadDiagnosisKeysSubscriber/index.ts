const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";

const convertMessage = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    const efgsData = JSON.parse(data);
    return {
        ...createGensPayloadMessage(efgsData.keysData),
        regions: ['PL'], // todo PSAFE-2456
        appPackageName: 'pl.gov.mc.protegosafe.devel', // todo PSAFE-2456
        platform: 'ios' // todo PSAFE-2456
    }
};

const uploadDiagnosisKeysSubscriber = async (message: any) => {

    const data = convertMessage(message.data);

    try {
        await uploadDiagnosisKeys(data)
    } catch (e) {
        if (e.response && e.response.error) {
            error(e.response.error.text)
        }
        throw new Error(e);
    }

    log('Processed uploading keys to gens');
};

export default uploadDiagnosisKeysSubscriber;
