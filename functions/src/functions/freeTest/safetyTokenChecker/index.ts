import errorLogger from "../../logger/errorLogger";

const {log} = require("firebase-functions/lib/logger");
import axios from 'axios';
import {v4} from 'uuid';
import {decode, sign} from "jsonwebtoken";
import config from "../../../config";
import {secretManager} from "../../../services";
import moment = require("moment");
import errorEntryLabels from "../../logger/errorEntryLabels";

const checkSafetyToken = async (safetyToken: string, platform: string): Promise<boolean> => {

    const {disabledSafetyToken} = await secretManager.getConfig('subscription');

    if (disabledSafetyToken) {
        return true;
    }

    if (platform === 'android') {
        return checkForAndroid(safetyToken) && checkSha256ForAndroid(safetyToken);
    }

    if (platform === 'ios') {
        return checkForIos(safetyToken);
    }

    return false;

};

const checkForAndroid = async (safetyToken: string): Promise<boolean> => {
    const {androidSafetyTokenPrivateApiKey: apiKey} = await secretManager.getConfig('subscription');

    return await axios.post(`${config.subscription.android.url}?key=${apiKey}`, {signedAttestation: safetyToken})
        .then(response => {
            const isValid = response.status === 200 && response.data.isValidSignature;

            if (!isValid) {
                log('invalid android safety token')
            }

            return isValid;
        }).catch(reason => {
            errorLogger.error(errorEntryLabels(reason), reason)

            return false;
        })
};

const checkSha256ForAndroid = async (safetyToken: string): Promise<boolean> => {
    const payload: any = decode(safetyToken)!;
    const {apkCertificateDigestSha256 = []} = payload;
    if (apkCertificateDigestSha256.length === 0) {
        return false;
    }
    const {androidSafetyTokenCertificateSha256List = []} = await secretManager.getConfig('subscription');
    const isValid = apkCertificateDigestSha256.every((value: string) => androidSafetyTokenCertificateSha256List.includes(value));

    if (!isValid) {
        log(`invalid android cert's sha256`)
    }

    return isValid;
};

const generateJwtTokenForIos = async (): Promise<string> => {
    const {iosSafetyTokenPrivateKey: privateKey} = await secretManager.getConfig('subscription');
    const {iosSafetyTokenKeyId: keyId} = await secretManager.getConfig('subscription');
    const {iosSafetyTokenTeamId: teamId} = await secretManager.getConfig('subscription');
    const payload = {iss: teamId, iat: moment().unix()};
    return sign(payload,
        privateKey,
        {
            header: {alg: 'ES256', kid: keyId}
        }
    );
};

const checkForIos = async (safetyToken: string): Promise<boolean> => {
    const jwtToken = await generateJwtTokenForIos();

    const payload = {
        device_token: safetyToken,
        timestamp: moment().unix() * 1000,
        transaction_id: v4()
    };

    return await axios.post(config.subscription.ios.url, payload, {
        headers: {Authorization: `Bearer ${jwtToken}`}
    })
        .then(response => {
            const isValid = response.status === 200;
            if (!isValid) {
                log('invalid ios safety token')
            }
            return isValid;
        }).catch(reason => {
            log(reason);
            return false;
        })
};


export default checkSafetyToken;
