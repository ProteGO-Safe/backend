import uploadedKeysMetricInitializer from "./uploadedKeysMetricInitializer";
import trackUploadedKeysMetric from "./trackUploadedKeysMetric";
import config from "../../config"

const {log} = require("firebase-functions/lib/logger");

const sendUploadedKeysOpenCensusMetricSubscriber = async (message: any) => {
    const {data} = message;
    const {temporaryExposureKeysLength, isInteroperabilityEnabled} = parseJson(data);

    log(`Received data for metric: ${config.metrics.uploadedKeyMetricName}, message: ${JSON.stringify(parseJson(data))}`);

    const openCensusContainer = uploadedKeysMetricInitializer(JSON.parse(process.env["FIREBASE_CONFIG"] as string).projectId);
    trackUploadedKeysMetric(temporaryExposureKeysLength, isInteroperabilityEnabled, openCensusContainer);

    log(`Tracked metric: ${config.metrics.uploadedKeyMetricName}, temporaryExposureKeysLength: ${temporaryExposureKeysLength}, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`);

    setTimeout(() => {
        log(`Done recording for metric: ${config.metrics.uploadedKeyMetricName}`);
        openCensusContainer.globalStats.unregisterExporter(openCensusContainer.exporter);
    }, config.metrics.uploadedKeyMetricInterval * 1000 + 20);
};

const parseJson = (dataAsBase64: any) => {
    const data = Buffer.from(dataAsBase64, 'base64')
        .toString();
    return JSON.parse(data);
};

export default sendUploadedKeysOpenCensusMetricSubscriber;
