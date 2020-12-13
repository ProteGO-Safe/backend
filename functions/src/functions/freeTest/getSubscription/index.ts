import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {secretManager, subscriptionRepository} from "../../../services";
import checkSafetyToken from "../safetyTokenChecker";
import {decode, verify} from "jsonwebtoken";
import returnBadRequestResponse from "../../returnBadRequestResponse";

const auth = async (token: string | undefined, guid: string | undefined): Promise<boolean> => {
    if (!token || !guid) {
        return false;
    }

    const {secret} = await secretManager.getConfig('subscription');

    try {
        verify(token, secret, {algorithms: ["HS512"]});
    } catch (e) {
        return false;
    }

    const payload:any = decode(token)!;

    return payload['guid'] === guid;
};

const getSubscription = async (request: functions.Request, response: functions.Response) => {

    try {
        const safetyToken = request.header("Safety-Token")!;
        const platform = request.header("User-Agent")!;
        const token = request.header("Authorization")!.replace('Bearer ', '');
        const {guid} = request.body;

        const isAuth = await auth(token, guid);

        if (!isAuth) {
            log(`Authorization token is invalid`);
            return returnBadRequestResponse(response);
        }

        const isValidSafetyToken = await checkSafetyToken(safetyToken, platform);

        if (!isValidSafetyToken) {
            log(`Safety token is invalid`);
            return returnBadRequestResponse(response);
        }

        const subscription = await subscriptionRepository.get(guid);

        if (!subscription.exists) {
            log(`subscription doesn't exist`);
            return returnBadRequestResponse(response);
        }

        const status = subscription.get('status');

        if (!status) {
            log(`invalid status`);
            return returnBadRequestResponse(response);
        }

        return response.status(200).send({guid, status});
    } catch (e) {
        log(e);
        return returnBadRequestResponse(response);
    }
};

export default getSubscription;

