import * as functions from "firebase-functions";
import {v4} from "uuid";
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";

const getSubscriptionCode = async (request: functions.Request, response: functions.Response) => {
    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
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
