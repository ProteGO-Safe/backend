import * as functions from "firebase-functions";
import {validateApiTokenAndIp} from "./ipAndApiTokenValidator";

const updateSubscription = async (request: functions.Request, response: functions.Response) => {

    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied.');
    }

    response.status(200).send({
        guid: request.body.guid,
        status: request.body.status
    });
};

export default updateSubscription;
