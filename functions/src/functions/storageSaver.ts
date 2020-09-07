import config from "../config";

const {Storage} = require('@google-cloud/storage');


export const saveFileInStorage = async (object: any, fileName: string) => {
    const storage = new Storage();
    const bucket = storage.bucket(config.buckets.cdn);

    const file = bucket.file(fileName);
    await file.save(JSON.stringify(object));
};
