import * as admin from "firebase-admin";
import config from "../config";
import {sha256} from "js-sha256";
import {v4} from "uuid";
import TokenRepository from "./TokenRepository";
import moment = require("moment");

class HashedAccessTokensRepository extends TokenRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('hashedAccessTokensRepository');
    }

    deleteTimeFieldName(): string {
        return "deleteTime"
    }

    async save(accessToken: string): Promise<FirebaseFirestore.WriteResult> {
        const hashedCode = sha256(accessToken);

        return await this.getCollection().doc(hashedCode).set({
            "id": v4(),
            [this.deleteTimeFieldName()]: config.jwt.lifetime * 60 + moment().unix()
        })
    }

    async get(accessToken: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        const hashedAccessToken = sha256(accessToken);

        return await this.getCollection().doc(hashedAccessToken).get();
    }
}

export default HashedAccessTokensRepository;
