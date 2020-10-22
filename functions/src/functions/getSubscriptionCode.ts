import {generateCodeIPChecker, secretManager} from "../config";
import * as functions from "firebase-functions";
import {v4} from "uuid";

const getSubscriptionCode = async (request: functions.Request, response: functions.Response) => {
    if (!await generateCodeIPChecker.allow(<string>request.header('Cf-Connecting-Ip'))) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    if (request.header('api-token') !== await secretManager.getConfig('apiToken')) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    response.status(200).send({
        subscription : {
            id: v4(),
            status: 1
        }
    });
}

export default getSubscriptionCode;
