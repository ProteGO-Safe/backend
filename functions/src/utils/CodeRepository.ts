import * as admin from "firebase-admin";
import {sha256} from "js-sha256";
import {v4} from 'uuid';
import moment = require("moment");

class CodeRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('codes');
    }

    async save(code: string, expiryTime: number, deleteTime: number): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).set({
            "id": v4(),
            "expiryTime": expiryTime,
            "deleteTime" : deleteTime
        })
    }

    async remove(code: string): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.removeByHashedCode(hashedCode);
    }

    async removeByHashedCode(hashedCode: string): Promise<FirebaseFirestore.WriteResult> {
        return await this.getCollection().doc(hashedCode).delete();
    }

    async get(code: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).get();
    }

    async update(code: string, fieldsToUpdate: any): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).update(fieldsToUpdate);
    }

    async removeExpired(): Promise<void> {
        await this.getCollection()
            .where('deleteTime', '<', moment().unix())
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => doc.ref.delete()))

        await this.getCollection()
            .where('deleteTime', '==', null)
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => doc.ref.delete()))
    }
}

export default CodeRepository;
