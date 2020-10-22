import config, {generateCodeIPChecker, secretManager} from "../config";
import * as functions from "firebase-functions";
import {v4} from "uuid";

const generateSubscriptionCode = async (request: functions.Request, response: functions.Response) => {
    if (!await generateCodeIPChecker.allow(<string>request.header('Cf-Connecting-Ip'))) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    if (request.header('api-token') !== await secretManager.getConfig('apiToken')) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    response.status(201).send({
        code: config.code.generator.generate(),
        guid: v4()
    });
}

export default generateSubscriptionCode;
