import config from "../config";
import moment = require("moment");
import {CallableContext} from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";

export async function generateCode(data : any, context: CallableContext) {
    if (context.rawRequest.header('api-token') !== await config.secretManager.getApiToken()) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid api token');
    }

    const code = config.code.generator.generate();
    const expiryTime = config.code.lifetime * 60 + moment().unix();

    await config.code.repository.save(code, expiryTime);

    return code;
}

export default generateCode;
