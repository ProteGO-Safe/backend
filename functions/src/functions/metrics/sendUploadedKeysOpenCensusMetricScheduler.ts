import uploadedKeysMetricInitializer from "./uploadedKeysMetricInitializer";
import {trackUploadedKeysMetric} from "./trackUploadedKeysMetric";
import config from "../../config"
import {metricRepository} from "./services";
import Metric from "./Metric";

const {log} = require("firebase-functions/lib/logger");

const sendUploadedKeysOpenCensusMetricScheduler = async () => {

    const metric = await metricRepository.getTheOldestOne();

    if (metric === null) {
        log(`No metric to send`);
        return;
    }

    processMetric(metric);

    await metricRepository.delete(metric.id);
};

const processMetric = (metric: Metric) => {
    log(`Received data for metric: ${metric.type}, message: ${JSON.stringify(metric)}`);

    const openCensusContainer = uploadedKeysMetricInitializer(JSON.parse(process.env["FIREBASE_CONFIG"] as string).projectId);
    trackUploadedKeysMetric(metric, openCensusContainer);

    setTimeout(() => {
        log(`Done recording for metric: ${config.metrics.uploadedKeyMetricName}`);
        openCensusContainer.globalStats.unregisterExporter(openCensusContainer.exporter);
    }, config.metrics.uploadedKeyMetricInterval * 1000 + 20);
};

export default sendUploadedKeysOpenCensusMetricScheduler;
