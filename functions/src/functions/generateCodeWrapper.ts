import {CallableContext} from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";
import {validateApiTokenAndIp} from "./ipAndApiTokenValidator";
import {generateCode} from "./codeGenerator";

const generateCodeWrapper = async (data : any, context: CallableContext) => {
    const isValid = await validateApiTokenAndIp(context.rawRequest);

    if (!isValid) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    const {code} = await generateCode();

    return code;
};

export default generateCodeWrapper;
