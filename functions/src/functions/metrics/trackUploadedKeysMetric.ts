import OpenCensusContainer from "./OpenCensusContainer";
import {TagMap} from "@opencensus/core";
import Metric from "./Metric";
import {metricTypes} from "./metricTypes";

const {log} = require("firebase-functions/lib/logger");

export const trackUploadedKeysMetric = (metric: Metric,
    {globalStats, tagKey, measure}: OpenCensusContainer
) => {

    if (metric.type !== metricTypes.uploadedKeys) {
        return;
    }

    const {isInteroperabilityEnabled, temporaryExposureKeysLength} = metric.data;

    const tags = new TagMap();
    tags.set(tagKey, {value: isInteroperabilityEnabled ? "true" : "false"});
    globalStats.record([{
        measure,
        value: temporaryExposureKeysLength
    }], tags);
    log(`Recorded metric: ${metric.type}, temporaryExposureKeysLength: ${temporaryExposureKeysLength}, isInteroperabilityEnabled: ${isInteroperabilityEnabled}`);
};
