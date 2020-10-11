const {Storage} = require('@google-cloud/storage');


export const saveFileInStorage = async (object: any, fileName: string, bucketName: string, compress: boolean = false) => {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    const file = bucket.file(fileName);
    await file.save(JSON.stringify(object), {gzip: compress});
};
