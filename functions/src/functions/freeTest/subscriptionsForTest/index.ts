import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import moment = require("moment");
import checkSafetyToken from "../safetyTokenChecker";
import {generateJwt} from "../../jwtGenerator";
import {validateCode} from "../../code/codeValidator";
import returnBadRequestResponse from "../../returnBadRequestResponse";
import {secretManager, codeRepository, subscriptionRepository} from "../../../services";

const subscriptionsForTest = async (request: functions.Request, response: functions.Response) => {

    try {
        const safetyToken = request.header("Safety-Token")!;
        const platform = request.header("User-Agent")!;
        const {guid, code} = request.body;

        const isValidSafetyToken = await checkSafetyToken(safetyToken, platform);

        if (!isValidSafetyToken) {
            log(`Safety token is invalid`);
            return returnBadRequestResponse(response);
        }

        const isCodeValid = await validateCode(code);

        if (!isCodeValid) {
            log(`Code is invalid`);
            return returnBadRequestResponse(response);
        }

        const codeEntity = await codeRepository.get(code);
        const codeSha256 = codeEntity.id;
        const codeId = codeEntity.get('id');
        await codeRepository.update(code, {expiryTime: moment().unix()});

        const subscription = await subscriptionRepository.get(guid);

        if (subscription.exists) {
            log(`subscription already exists`);
            return returnBadRequestResponse(response);
        }

        const existingSubscription = await subscriptionRepository.getByCodeSha256(codeSha256);

        if (existingSubscription) {
            log(`subscription already exists`);
            return returnBadRequestResponse(response);
        }

        subscriptionRepository.save(guid, {
            created: moment().unix(),
            codeId,
            codeSha256,
            status: 1
        }).catch(reason => {
            log(reason);
            return returnBadRequestResponse(response);
        });
        const {secret, lifetime} = await secretManager.getConfig('subscription');

        const accessToken = await generateJwt({guid}, secret, lifetime);

        log(`created subscription, return code: 201`);

        return response.status(201).send({token: accessToken});
    } catch (e) {
        log(e);
        return returnBadRequestResponse(response);
    }
};

export default subscriptionsForTest;
