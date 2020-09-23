import efgsDiagnosisKeysFactory from "../efgsDiagnosisKeysFactory";
import uploadKeysToEfgs from "../efgsUploader";
import {deleteDiagnosisKeys} from "../efgsStorageManager/efgsStorageManager";

export const efgsUploadTrigger = async (event: any, context: any) => {
    const data = event.data();
    const {id} = data;
    console.log(`uploading diagnosis keys on firestore, id: ${id}`);
    const efgsItem = efgsDiagnosisKeysFactory(data);
    await uploadKeysToEfgs(efgsItem)
        .catch(reason => {throw new Error(reason)})
        .then(ignore => deleteDiagnosisKeys(id));
};

export default efgsUploadTrigger;

