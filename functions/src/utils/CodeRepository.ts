import * as admin from "firebase-admin";
import {sha256} from "js-sha256";
import {v4} from 'uuid';
import TokenRepository from "./TokenRepository";
import ArrayHelper from "./ArrayHelper";


class CodeRepository extends TokenRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('codes');
    }

    deleteTimeFieldName(): string {
        return "deleteTime"
    }

    async save(code: string, expiryTime: number, deleteTime: number): Promise<string> {
        const savedCodes = await this.saveCodes([code], expiryTime, deleteTime);

        return <string> savedCodes.pop();
    }

    async saveCodes(codes: Array<string>, expiryTime: number, deleteTime: number): Promise<Array<string>> {
        const batch = admin.firestore().batch();

        codes.forEach(code => {
            const hashedCode = sha256(code), id = v4();

            batch.set(this.getCollection().doc(hashedCode), {
                "id": id,
                'hashedCode' : hashedCode,
                "expiryTime": expiryTime,
                [this.deleteTimeFieldName()]: deleteTime
            })
        })

        await batch.commit();

        return codes;
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

    async existsHashedCodes(hashedCodes: Array<string>): Promise<boolean> {
        return !(await this.getCollection().where('hashedCode', 'in', hashedCodes).get()).empty
    }

    async exists(codes: Array<string>): Promise<boolean> {
        const hashedCodes = codes.map(code => sha256(code))

        const existingHashedCodesChunks = await Promise.all(
            ArrayHelper.chunkArray(hashedCodes, 10).map(async chunk => await this.existsHashedCodes(chunk))
        );

        return !!existingHashedCodesChunks.filter(Boolean).length;
    }
}

export default CodeRepository;
