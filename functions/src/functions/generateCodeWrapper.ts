const {log} = require("firebase-functions/lib/logger");
import {CallableContext} from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";
import {validateApiTokenAndIp} from "./ipAndApiTokenValidator";
import {generateCode} from "./code/codeGenerator";

const generateCodeWrapper = async (data : any, context: CallableContext) => {
    const isValid = await validateApiTokenAndIp(context.rawRequest);

    if (!isValid) {
        log(`failed generating code, return code: 403`);
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    const {code} = await generateCode();

    log(`generated code, return code: 200`);

    return code;
};

export default generateCodeWrapper;
