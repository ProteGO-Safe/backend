import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {sha256} from "js-sha256";
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";
import returnBadRequestResponse from "../returnBadRequestResponse";
import {subscriptionRepository} from "../../services";

const findSubscription = async (codeId: string, code: string): Promise<any> => {
    if (codeId) {
        return await subscriptionRepository.getByCodeId(codeId);
    }
    if (code) {
        const codeSha256 = sha256(code);
        return await subscriptionRepository.getByCodeSha256(codeSha256);
    }
    return undefined;

};

const getSubscriptionCode = async (request: functions.Request, response: functions.Response) => {
    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        log("not authorize request");
        return returnBadRequestResponse(response);
    }

    const {id: codeId, code} = request.body;

    const subscription = await findSubscription(codeId, code);

    if (!subscription) {
        log("subscription doesn't exist");
        return returnBadRequestResponse(response);
    }

    const {id, status} = subscription;

    return response.status(200).send({
        subscription: {id, status}
    });
};

export default getSubscriptionCode;
