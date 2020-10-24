import * as functions from "firebase-functions";

const {log} = require("firebase-functions/lib/logger");
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";
import returnBadRequestResponse from "../returnBadRequestResponse";
import config from "../../config";

const updateSubscription = async (request: functions.Request, response: functions.Response) => {

    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        log("not authorize request");
        returnBadRequestResponse(response);
    }

    const {guid, status} = request.body;

    const subscription = await config.subscription.repository.get(guid);

    if (!subscription.exists) {
        log(`subscription doesn't exist`);
        returnBadRequestResponse(response);
    }

    const currentStatus = subscription.get("status");

    if (currentStatus > status) {
        log("illegal status value");
        returnBadRequestResponse(response);
    }

    await config.code.repository.removeByHashedCode(<string>subscription.get('codeSha256'));

    await config.subscription.repository.update(guid, {status: status, codeSha256: null, codeId: null});

    response.status(200).send({
        guid,
        status
    });
};

export default updateSubscription;
