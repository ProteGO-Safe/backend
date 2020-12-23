import {codeRepository} from "../../../services";
import moment = require("moment");

export const validateCode = async (code: string): Promise<boolean> => {
    if (!code) {
        return false;
    }

    const storedCode = await codeRepository.get(code);

    if (!storedCode.exists) {
        return false;
    }

    if (storedCode.get('expiryTime') < moment().unix()) {
        return false;
    }

    return true;
};
