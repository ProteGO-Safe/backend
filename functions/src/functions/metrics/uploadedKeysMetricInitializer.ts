import {StackdriverStatsExporter} from "@opencensus/exporter-stackdriver";
import {AggregationType, globalStats, MeasureUnit} from "@opencensus/core";
import OpenCensusContainer from "./OpenCensusContainer";
import config from "../../config"
import errorLogger from "../logger/errorLogger";
import errorEntryLabels from "../logger/errorEntryLabels";

const {log} = require("firebase-functions/lib/logger");

export default (projectId: string): OpenCensusContainer => {
    const exporter = new StackdriverStatsExporter({
        projectId,
        period: config.metrics.uploadedKeyMetricInterval * 1000,
        onMetricUploadError: (err) => {
            const errorMessage = `Failed to upload metric: ${config.metrics.uploadedKeyMetricName}, ${err.name}, ${err.message}`;
            errorLogger.error(errorEntryLabels(errorMessage), errorMessage);
        }
    });

    const isInteroperabilityEnabledTag = {name: "isInteroperabilityEnabled"};

    const uploadedKeysCount = globalStats.createMeasureInt64(
        config.metrics.uploadedKeyMetricName,
        MeasureUnit.UNIT,
        config.metrics.uploadedKeyMetricDescription,
    );

    const uploadedKeysView = globalStats.createView(
        config.metrics.uploadedKeyMetricName,
        uploadedKeysCount,
        AggregationType.SUM,
        [isInteroperabilityEnabledTag],
        config.metrics.uploadedKeyMetricDescription,
    );

    globalStats.registerView(uploadedKeysView);
    globalStats.registerExporter(exporter);

    log(`Create view and exporter for metric: ${config.metrics.uploadedKeyMetricName}`);

    return new OpenCensusContainer(
        globalStats,
        exporter,
        isInteroperabilityEnabledTag,
        uploadedKeysCount
    );
};
