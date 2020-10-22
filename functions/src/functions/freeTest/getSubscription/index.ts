import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import config, {secretManager} from "../../../config";
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
            returnBadRequestResponse(response);
        }

        const isValidSafetyToken = await checkSafetyToken(safetyToken, platform);

        if (!isValidSafetyToken) {
            log(`Safety token is invalid`);
            returnBadRequestResponse(response);
        }

        const subscription = await config.subscription.repository.get(guid);

        if (!subscription.exists) {
            log(`subscription doesn't exist`);
            returnBadRequestResponse(response);
        }

        const status = subscription.get('status');

        if (!status) {
            log(`invalid status`);
            returnBadRequestResponse(response);
        }

        response.status(200).send({guid, status});
    } catch (e) {
        log(e);
        returnBadRequestResponse(response);
    }
};

export default getSubscription;

