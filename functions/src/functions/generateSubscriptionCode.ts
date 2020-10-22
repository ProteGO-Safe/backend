import config from "../config";
import * as functions from "firebase-functions";
import {v4} from "uuid";
import {validateApiTokenAndIp} from "./ipAndApiTokenValidator";

const generateSubscriptionCode = async (request: functions.Request, response: functions.Response) => {

    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    response.status(201).send({
        code: config.code.generator.generate(),
        guid: v4()
    });
}

export default generateSubscriptionCode;
