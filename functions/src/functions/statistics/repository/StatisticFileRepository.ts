import {Bucket, Storage} from "@google-cloud/storage";
import {log} from "firebase-functions/lib/logger";
import {secretManager} from "../../../services";
import errorLogger from "../../logger/errorLogger";
import errorEntryLabels from "../../logger/errorEntryLabels";

class StatisticFileRepository {
    private bucket: Bucket;

    async getBucket(): Promise<Bucket> {
        if (!this.bucket) {
            await this.init();
        }

        return this.bucket;
    }

    async saveFile(data: any, fileName: string): Promise<void> {
        log(`saving file ${fileName}`);
        const bucket = await this.getBucket();
        bucket
            .file(fileName)
            .save(
                JSON.stringify(data),
                err => {
                    err ? errorLogger.error(errorEntryLabels(`Cannot save file`), err) : undefined
                }
            );
        log(`saved file ${fileName}`);
    }

    private async init(): Promise<void> {
        const {bucketName} = await secretManager.getConfig('statistics');

        this.bucket = new Storage().bucket(bucketName);
    }
}

export default StatisticFileRepository;
