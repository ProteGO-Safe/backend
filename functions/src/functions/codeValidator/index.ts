import config from "../../config";
import moment = require("moment");

export const validateCode = async (code: string): Promise<boolean> => {
    if (!code) {
        return false;
    }

    const repository = config.code.repository;
    const storedCode = await repository.get(code);

    if (!storedCode.exists) {
        return false;
    }

    if (storedCode.get('expiryTime') < moment().unix()) {
        return false;
    }

    return true;
};
