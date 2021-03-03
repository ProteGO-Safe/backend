import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import {Storage} from "@google-cloud/storage";
import {log} from "firebase-functions/lib/logger";
import config from "../config"
import errorLogger from "./logger/errorLogger";
import errorEntryLabels from "./logger/errorEntryLabels";

const disableCacheOnBucket = async (metadata : ObjectMetadata) => {

    const fileName = metadata.name!;
    const disabledCacheBucketFiles = [
        config.statistics.files.covidInfo,
        config.statistics.files.timestamps,
        config.statistics.files.dashboard,
        config.statistics.files.details,
        config.statistics.files.districts,
    ];

    if (!disabledCacheBucketFiles.includes(fileName)) {
        return;
    }

    log(`disabling cache on bucket for file: ${fileName}`);

    const bucket = new Storage().bucket(metadata.bucket);

    bucket
        .file(fileName)
        .setMetadata({
            cacheControl: "no-store, max-age=0"
        }).catch(err => {err ? errorLogger.error(errorEntryLabels(`Cannot change cache control`), err) : undefined})
};

export default disableCacheOnBucket;
