import assert = require("assert");
import efgsDiagnosisKeysFactory from "../efgsDiagnosisKeysFactory";
import uploadKeysToEfgs from "../efgsUploader";
import {deleteDiagnosisKeys} from "../efgsStorageManager/efgsStorageManager";
import {GensItem} from "../efgs.types";

export const efgsUploadTrigger = async (event: any, context: any) => {
    const data : GensItem = event.data();
    assert(data.allowSentToEfgs, 'value allowSentToEfgs must be true');
    const {id} = data;
    console.log(`uploading diagnosis keys on firestore, id: ${id}`);
    const efgsItem = efgsDiagnosisKeysFactory(data);
    await uploadKeysToEfgs(efgsItem)
        .catch(reason => {throw new Error(reason)})
        .then(ignore => deleteDiagnosisKeys(id));
};

export default efgsUploadTrigger;
