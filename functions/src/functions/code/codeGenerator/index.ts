import config from "../../../config";
import moment = require("moment");


export const generateCode = async (deleteTime?: number): Promise<any> => {
    let code;

    do {
        code = config.code.generator.generate();
    } while ((await config.code.repository.get(code)).exists);

    const expiryTime = 30 * 60 + moment().unix(); // 30 minutes

    await config.code.repository.save(code, expiryTime, deleteTime || expiryTime);
    const codeEntity = await config.code.repository.get(code);

    return {id: codeEntity.get('id'), code};
};
