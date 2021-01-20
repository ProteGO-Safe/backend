import config from "../config";
import {codeRepository, secretManager} from "../services";
import * as functions from "firebase-functions";
import {generateJwt} from "./jwtGenerator";
import {validateCode} from "./code/codeValidator";
import codeLogger from "./logger/codeLogger";
import getCodeLogEntryLabels from "./logger/getCodeLogEntryLabels";
import {CodeEvent} from "./code/CodeEvent";
import {sha256} from "js-sha256";
import {CodeStatus} from "./code/CodeStatus";

const logCodeEventForAccessToken = (hashedCode: string, codeEvent: CodeEvent, codeStatus?: CodeStatus) => {
    codeLogger.info(getCodeLogEntryLabels(
        hashedCode,
        codeEvent,
        "",
        codeStatus
    ), `${codeEvent} : ${hashedCode}`);
}

export const getAccessToken = async (data: any) => {

    const isCodeValid = await validateCode(data.code);
    const hashedCode = sha256(data.code);

    logCodeEventForAccessToken(hashedCode, CodeEvent.ATTEMPTED_CODE);

    if (!isCodeValid) {
        logCodeEventForAccessToken(hashedCode, CodeEvent.CODE_IS_NOT_VALID);

        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    logCodeEventForAccessToken(hashedCode, CodeEvent.USED_CODE, CodeStatus.USED);

    await codeRepository.remove(data.code);

    const secret = await secretManager.getConfig('secret');
    const accessToken = await generateJwt({code: data.code}, secret, config.jwt.lifetime);

    logCodeEventForAccessToken(hashedCode, CodeEvent.REMOVED_CODE, CodeStatus.USED);

    return {accessToken: accessToken};
};
