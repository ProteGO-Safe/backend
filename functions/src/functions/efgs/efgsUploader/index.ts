import axios from "axios";
import {EfgsItem} from "../efgs.types";
import config from "../../../config";
import generateBatchTag from "../batchTagGenerator";
import generateBatchSignature from "../batchSignatureGenerator";

const UPLOAD_URL = config.efgs.serverUrl;

export const uploadKeysToEfgs = async (item: EfgsItem) => {

    await axios.post(`${UPLOAD_URL}/diagnosiskeys/upload`, item, {
        headers: {
            'X-SSL-Client-SHA256': '5bff3af532512378925b2b6e2ccb53c44a4802ea983bae195054cc3138db42a4',
            'X-SSL-Client-DN': 'C=DE',
            'batchTag': generateBatchTag(),
            'Content-Type': 'application/json; version=1.0',
            'batchSignature': generateBatchSignature(item),
        }
    }).catch(reason => {
        throw new Error(reason);
    })
};


export default uploadKeysToEfgs;
