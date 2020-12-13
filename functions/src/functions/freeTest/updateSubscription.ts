import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";
import returnBadRequestResponse from "../returnBadRequestResponse";
import {subscriptionRepository, codeRepository} from "../../services";

const updateSubscription = async (request: functions.Request, response: functions.Response) => {

    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        log("not authorize request");
        return returnBadRequestResponse(response);
    }

    const {guid, status} = request.body;

    const subscription = await subscriptionRepository.get(guid);

    if (!subscription.exists) {
        log(`subscription doesn't exist`);
        return returnBadRequestResponse(response);
    }

    const currentStatus = subscription.get("status");

    if (currentStatus > status) {
        log("illegal status value");
        return returnBadRequestResponse(response);
    }

    const codeSha256 = <string>subscription.get('codeSha256');
    if (codeSha256) {
        await codeRepository.removeByHashedCode(codeSha256);
    }

    await subscriptionRepository.update(guid, {status: status, codeSha256: null, codeId: null});

    log(`updated subscription, return code: 200`);

    return response.status(200).send({
        guid,
        status
    });
};

export default updateSubscription;
