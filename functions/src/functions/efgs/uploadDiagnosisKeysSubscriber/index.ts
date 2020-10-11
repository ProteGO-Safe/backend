import uploadDiagnosisKeys from "../../uploadDiagnosisKeys";

const convertMessage = (dataAsBase64: any) => {
    console.log(dataAsBase64);
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString()
        .replace(/"{/g, '{')
        .replace(/}"/g, '}')
        .replace(/\\"/g, '"');
    console.log(data);

    console.log("-----")
    console.log(JSON.parse(data));
    // todo PSAFE-2096
    return {}
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