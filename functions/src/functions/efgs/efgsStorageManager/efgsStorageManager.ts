import * as admin from "firebase-admin";
import {v4} from "uuid";
import config from "../../../config";

export const saveDiagnosisKeys = (body: any) => {
    const {allowSentToEfgs} = body;
    if (!allowSentToEfgs) {
        return;
    }
    const id = v4();
    const db = admin.firestore();
    const itemToSave = {id, ...body};
    console.log(`saving diagnosis keys on firestore: ${JSON.stringify(itemToSave)}`);
    db.collection(config.efgs.firestore.diagnosisKeysCollectionName)
        .doc(id)
        .set(itemToSave)
        .catch(reason => {throw new Error(reason)});
};

export const deleteDiagnosisKeys = (id: string) => {
    console.log(`deleting diagnosis keys from firestore: ${id}`)
    const db = admin.firestore();
    const ref = db.collection(config.efgs.firestore.diagnosisKeysCollectionName).doc(id);
    ref.delete()
        .catch(reason => {throw new Error(reason)});
};
