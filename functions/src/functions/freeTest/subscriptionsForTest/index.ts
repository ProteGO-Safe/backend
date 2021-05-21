import * as functions from "firebase-functions";
import {generateJwt} from "../../jwtGenerator";
import {validateCode} from "../../code/codeValidator";
import returnBadRequestResponse from "../../returnBadRequestResponse";
import {codeRepository, secretManager, subscriptionRepository} from "../../../services";
import {CodeEvent} from "../../code/CodeEvent";
import codeLogger from "../../logger/codeLogger";
import getCodeLogEntryLabels from "../../logger/getCodeLogEntryLabels";
import {sha256} from "js-sha256";
import {CodeStatus} from "../../code/CodeStatus";

const {log} = require("firebase-functions/lib/logger");
import moment = require("moment");
import errorLogger from "../../logger/errorLogger";
import errorEntryLabels from "../../logger/errorEntryLabels";

const logCodeEventForSubscriptionsForTest = (
    hashedCode: string,
    codeEvent: CodeEvent,
    platform: string,
    codeStatus?: CodeStatus
) => {
    codeLogger.info(getCodeLogEntryLabels(
        hashedCode,
        codeEvent,
        platform,
        codeStatus
    ), `${codeEvent} : ${hashedCode}`);
}

const subscriptionsForTest = async (request: functions.Request, response: functions.Response) => {

    try {
        const platform = request.header("User-Agent")!;
        const {guid, code} = request.body;

        const hashedCode = sha256(code);
        const isCodeValid = await validateCode(code);

        logCodeEventForSubscriptionsForTest(hashedCode, CodeEvent.ATTEMPTED_CODE, platform);

        if (!isCodeValid) {
            logCodeEventForSubscriptionsForTest(hashedCode, CodeEvent.CODE_IS_NOT_VALID, platform);

            return returnBadRequestResponse(response);
        }

        const codeEntity = await codeRepository.get(code);
        const codeSha256 = codeEntity.id;
        const codeId = codeEntity.get('id');
        await codeRepository.update(code, {expiryTime: moment().unix()});

        logCodeEventForSubscriptionsForTest(hashedCode, CodeEvent.USED_CODE, platform, CodeStatus.USED);

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
            errorLogger.error(errorEntryLabels(reason), reason);

            return returnBadRequestResponse(response);
        });
        const {secret, lifetime} = await secretManager.getConfig('subscription');

        const accessToken = await generateJwt({guid}, secret, lifetime);

        log(`created subscription, return code: 201`);

        return response.status(201).send({token: accessToken});
    } catch (e) {
        errorLogger.error(errorEntryLabels(e), e);

        return returnBadRequestResponse(response);
    }
};

export default subscriptionsForTest;
