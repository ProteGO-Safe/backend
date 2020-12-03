import * as admin from "firebase-admin";
import {sha256} from "js-sha256";
import {v4} from 'uuid';
import TokenRepository from "./TokenRepository";

class CodeRepository extends TokenRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('codes');
    }

    deleteTimeFieldName(): string {
        return "deleteTime"
    }

    async save(code: string, expiryTime: number, deleteTime: number): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(code);

        return await this.getCollection().doc(hashedCode).set({
            "id": v4(),
            "expiryTime": expiryTime,
            [this.deleteTimeFieldName()]: deleteTime
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
}

export default CodeRepository;
