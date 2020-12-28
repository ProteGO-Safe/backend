const {log} = require("firebase-functions/lib/logger");
import config from "../../../config";

const createGensPayloadMessage = (keysData: any) => ({
    temporaryExposureKeys: keysData.map((item: any) => {
        const {keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel} = item;
        return {
            rollingPeriod: rollingPeriod,
            key: keyData,
            rollingStartNumber: rollingStartIntervalNumber,
            transmissionRisk: transmissionRiskLevel
        }
    })
});

const parseJson = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    return JSON.parse(data);
};

const convertMessage = (efgsData: any, appPackageName: string) => {

    return {
        ...createGensPayloadMessage(efgsData.keysData),
        regions: config.efgs.gens.regions,
        appPackageName,
        platform: config.efgs.gens.platform
    }
};

const createGensPayloadMessageFromEfgsMessageData = (dataAsBase64: string, appPackageName: string) => {

    const efgsData = parseJson(dataAsBase64);

    log(`creating gens payload message from batchTag ${efgsData.batchTag}`);

    return convertMessage(efgsData, appPackageName);
};

export default createGensPayloadMessageFromEfgsMessageData;