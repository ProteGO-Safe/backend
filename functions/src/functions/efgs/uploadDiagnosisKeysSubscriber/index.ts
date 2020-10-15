const {log, error} = require("firebase-functions/lib/logger");
import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";

const convertMessage = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    const efgsData = JSON.parse(data);
    return createGensPayloadMessage(efgsData)
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

    message.ack();
};

export default uploadDiagnosisKeysSubscriber;