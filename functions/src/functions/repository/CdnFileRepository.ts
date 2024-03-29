import {Bucket, Storage} from "@google-cloud/storage";
import * as ff from 'firebase-functions';
import iconvlite = require('iconv-lite');
import {log} from "firebase-functions/lib/logger";
import errorLogger from "../logger/errorLogger";
import errorEntryLabels from "../logger/errorEntryLabels";

class CdnFileRepository {
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
        const file = bucket.file(fileName);

        try {
            await file.save(JSON.stringify(data));
        } catch (e) {
            errorLogger.error(errorEntryLabels(`Cannot save file ${fileName}`), e);
            throw e;
        }

        log(`saved file ${fileName}`);
    }

    async readFile(fileName: string): Promise<string> {
        log(`reading file ${fileName}`);
        const bucket = await this.getBucket();
        const response = await bucket
            .file(fileName)
            .download();
        const data = response[0];

        log(`readed file ${fileName}`);

        return iconvlite.decode(data, 'win1250');
    }

    async readFileCreatedDate(fileName: string): Promise<Date> {
        log(`reading file ${fileName}`);
        const bucket = await this.getBucket();
        const response = await bucket
            .file(fileName);

        const metadata = (await response.getMetadata())[0];

        return new Date(metadata.timeCreated);
    }

    private async init(): Promise<void> {

        const {cdnbucket} = ff.config().config;

        this.bucket = new Storage().bucket(cdnbucket);
    }
}

export default CdnFileRepository;
