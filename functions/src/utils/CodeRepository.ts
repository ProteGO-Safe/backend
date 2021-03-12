import * as admin from "firebase-admin";
import {sha256} from "js-sha256";
import {v4} from 'uuid';
import TokenRepository from "./TokenRepository";
import ArrayHelper from "./ArrayHelper";
import codeLogger from "../functions/logger/codeLogger";
import getCodeLogEntryLabels from "../functions/logger/getCodeLogEntryLabels";
import {CodeStatus} from "../functions/code/CodeStatus";
import {CodeType} from "../functions/code/CodeType";
import {CodeEvent} from "../functions/code/CodeEvent";
import {firestore} from "firebase-admin/lib/firestore";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import DocumentData = firestore.DocumentData;
import CodeWithId from "./CodeWithId";

class CodeRepository extends TokenRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('codes');
    }

    deleteTimeFieldName(): string {
        return "deleteTime"
    }

    async save(code: string, expiryTime: number, deleteTime: number): Promise<CodeWithId> {
        const savedCodes = await this.saveCodes([code], expiryTime, deleteTime);

        return <CodeWithId>savedCodes.pop();
    }

    async saveCodes(codes: Array<string>, expiryTime: number, deleteTime: number): Promise<Array<CodeWithId>> {
        const batch = admin.firestore().batch();
        const codeObjects = new Array<any>();

        const codesWithIds: Array<CodeWithId> = codes.map(code => ({
            id: v4(),
            code
        }));

        codesWithIds.forEach(codeWithId => {
            const {id, code} = codeWithId;
            const hashedCode = sha256(code);
            const codeObject = {
                "id": id,
                'hashedCode': hashedCode,
                "expiryTime": expiryTime,
                [this.deleteTimeFieldName()]: deleteTime
            };

            batch.set(this.getCollection().doc(hashedCode), codeObject)
            codeObjects.push(codeObject)
        });

        await batch.commit();

        codeObjects.forEach((code: any) => {
            codeLogger.info(getCodeLogEntryLabels(
                code.hashedCode,
                CodeEvent.GENERATED_CODE,
                "",
                CodeStatus.NOT_USED,
                code.expiryTime === code.deleteTime ? CodeType.PIN : CodeType.LAB,
                code.expiryTime,
                code.deleteTime
            ), `${CodeEvent.GENERATED_CODE} : ${code.hashedCode}`);
        });

        return codesWithIds;
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

    onRemoved(doc: QueryDocumentSnapshot<DocumentData>) {
        const hashedCode = doc.data().hashedCode;

        codeLogger.info(getCodeLogEntryLabels(
            hashedCode,
            CodeEvent.REMOVED_CODE,
        ), `${CodeEvent.REMOVED_CODE} : ${hashedCode}`);
    }
}

export default CodeRepository;
