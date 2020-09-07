import * as admin from "firebase-admin";
import {sha256} from "js-sha256";
import moment = require("moment");

class CodeRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('codes');
    }

    async save(code: string, expiryTime: number): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).set({"expiryTime": expiryTime})
    }

    async remove(code: string): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).delete();
    }

    async get(code: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).get();
    }

    async removeExpired(): Promise<void> {
        await this.getCollection()
            .where('expiryTime', '<', moment().unix())
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => doc.ref.delete()))
    }
}

export default CodeRepository;
