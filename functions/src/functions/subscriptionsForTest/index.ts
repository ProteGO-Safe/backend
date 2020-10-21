import * as functions from "firebase-functions";

const {log} = require("firebase-functions/lib/logger");
import moment = require("moment");
import checkSafetyToken from "../safetyTokenChecker";
import config, {secretManager} from "../../config";
import {generateJwt} from "../jwtGenerator";
import {validateCode} from "../codeValidator";

const returnBadRequestResponse = (response: functions.Response) => {
    response.status(400).send();
};

const subscriptionsForTest = async (request: functions.Request, response: functions.Response) => {

    try {
        const safetyToken = request.header("Safety-Token")!;
        const platform = request.header("User-Agent")!;
        const {guid, code} = request.body;

        const isValidSafetyToken = await checkSafetyToken(safetyToken, platform);

        if (!isValidSafetyToken) {
            log(`Safety token is invalid`);
            returnBadRequestResponse(response);
        }

        const isCodeValid = await validateCode(code);

        if (!isCodeValid) {
            log(`Code is invalid`);
            returnBadRequestResponse(response);
        }

        const subscription = await config.subscription.repository.get(guid);

        if (subscription.exists) {
            log(`subscription already exists`);
            returnBadRequestResponse(response);
        }

        config.subscription.repository.save(guid, {
            created: moment().unix(),
            status: 1
        }).catch(reason => {
            log(reason);
            returnBadRequestResponse(response);
        });
        const {secret, lifetime} = await secretManager.getConfig('subscription');

        const accessToken = await generateJwt({guid}, secret, lifetime);

        const repository = config.code.repository;
        await repository.remove(code);

        response.status(201).send({token: accessToken});
    } catch (e) {
        log(e);
        returnBadRequestResponse(response);
    }
};

export default subscriptionsForTest;
