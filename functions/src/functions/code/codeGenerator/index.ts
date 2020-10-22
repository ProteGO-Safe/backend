import config from "../../../config";
import moment = require("moment");


export const generateCode = async (): Promise<any> => {
    let code;

    do {
        code = config.code.generator.generate();
    } while ((await config.code.repository.get(code)).exists);

    const expiryTime = config.code.lifetime * 60 + moment().unix();

    await config.code.repository.save(code, expiryTime);
    const {id} = await config.code.repository.get(code);

    return {id, code};
};
