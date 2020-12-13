import {codeGenerator, codeRepository} from "../../../services";
import config from "../../../config";
import moment = require("moment");


export const generateCode = async (deleteTime?: number): Promise<any> => {
    let code;

    do {
        code = codeGenerator.generate();
    } while ((await codeRepository.get(code)).exists);

    const expiryTime = config.code.lifetime * 60 + moment().unix();

    await codeRepository.save(code, expiryTime, deleteTime || expiryTime);
    const codeEntity = await codeRepository.get(code);

    return {id: codeEntity.get('id'), code};
};
