import config, {ipChecker, secretManager} from "../config";
import {CallableContext} from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";
import moment = require("moment");

export async function generateCode(data : any, context: CallableContext) {
    if (!await ipChecker.allow(context.rawRequest.ip)) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    if (context.rawRequest.header('api-token') !== await secretManager.getConfig('apiToken')) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    const code = config.code.generator.generate();
    const expiryTime = config.code.lifetime * 60 + moment().unix();

    await config.code.repository.save(code, expiryTime);

    return code;
}

export default generateCode;
