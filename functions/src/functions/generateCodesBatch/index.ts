import {CallableContext} from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";
import {codeGenerator, codeRepository} from "../../services";
import isValidDuration from "./validator/durationValidator";
import isValidNumberOfCodes from "./validator/numberOfCodesValidator";
import moment = require("moment");
import ArrayHelper from "../../utils/ArrayHelper";

const {log} = require("firebase-functions/lib/logger");


const generateCodesBatch = async (data : any, context: CallableContext) => {
    const isValid = await validateApiTokenAndIp(context.rawRequest);
    const {duration, numberOfCodes} = context.rawRequest.body.data;

    if (!isValid) {
        log(`failed generating codes batch, return code: 403`);
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    if (!isValidNumberOfCodes(numberOfCodes)) {
        log(`failed generating codes batch, invalid argument: numberOfCodes`);
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Parameter numberOfCodes accepts numbers in range 1-1000.'
        );
    }

    if (!isValidDuration(duration)) {
        log(`failed generating codes batch, invalid argument: duration`);
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Parameter duration accepts only numbers: 1800, 3600, 7200, 10800, ..., 86400.'
        );
    }

    const expiryTime = moment().unix() + duration;
    const maxBatchSave = 500;

    const chunkedBatch =
        ArrayHelper.chunkArray(Array(numberOfCodes).fill(true), maxBatchSave)
            .map(fillWithCodes)
            .map(async (chunk) => {
                const codesWithIds = await codeRepository.saveCodes(await chunk, expiryTime, expiryTime);
                return codesWithIds.map(value => value.code);
            });

    const batch = await Promise.all(chunkedBatch);

    log(`generated codes batch with ${numberOfCodes} codes, return code: 200`);

    return ArrayHelper.flatArray(batch);
};

const fillWithCodes = async (array: Array<string>): Promise<Array<string>> => {
    let mappedArray;

    do {
        mappedArray = array.map(() => codeGenerator.generate())
    } while (await codeRepository.exists(mappedArray))

    return mappedArray;
}

export default generateCodesBatch;
