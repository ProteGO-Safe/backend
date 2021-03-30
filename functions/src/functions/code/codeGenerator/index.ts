import {codeGenerator, codeRepository} from "../../../services";


export const generateCode = async (expiryTime: number, deleteTime?: number): Promise<any> => {
    let code;

    do {
        code = codeGenerator.generate();
    } while ((await codeRepository.get(code)).exists);

    const {id} = await codeRepository.save(code, expiryTime, deleteTime || expiryTime);

    return {id, code};
};
