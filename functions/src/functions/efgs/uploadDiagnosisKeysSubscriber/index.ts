import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";
import createGensPayloadMessage from "../gensPayloadFactory";

const convertMessage = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString()
        .replace(/"{/g, '{')
        .replace(/}"/g, '}')
        .replace(/\\"/g, '"');

    return createGensPayloadMessage(JSON.parse(data))
};

const uploadDiagnosisKeysSubscriber = async (message: any) => {

    const data = convertMessage(message.data);

    try {
        await uploadDiagnosisKeys(data)
    } catch (error) {
        throw new Error(error);
    }

    message.ack();
};

export default uploadDiagnosisKeysSubscriber;