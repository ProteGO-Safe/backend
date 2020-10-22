import * as functions from "firebase-functions";
import {generateCodeIPChecker, secretManager} from "../../config";

export const validateApiTokenAndIp = async (request: functions.Request): Promise<boolean> => {

    const ip = request.header('Cf-Connecting-Ip');
    const apiToken = request.header('api-token');

    if (!ip || !apiToken) {
        return false;
    }

    if (!await generateCodeIPChecker.allow(ip)) {
        return false;
    }

    if (apiToken !== await secretManager.getConfig('apiToken')) {
        return false;
    }

    return true
};
