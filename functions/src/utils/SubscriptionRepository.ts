import * as admin from "firebase-admin";

class SubscriptionRepository {

    getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('subscriptionsForTest');
    }

    async save(guid: string, body: any): Promise<FirebaseFirestore.WriteResult> {
        return await this.getCollection().doc(guid).set(body);
    }

    async get(guid: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        return await this.getCollection().doc(guid).get();
    }

    async getByCodeSha256(codeSha256: string): Promise<any> {
        return this.getByProperty('codeSha256', codeSha256);
    }

    async getByCodeId(codeId: string): Promise<any> {
        return this.getByProperty('codeId', codeId);
    }

    private async getByProperty(property: string, value: string): Promise<any> {
        const snapshot = await this.getCollection().where(property, '==', value).get();
        if (snapshot.empty) {
            return undefined;
        }

        let subscription = undefined;

        snapshot.forEach(doc => {
            const id = doc.id;
            const {status} = doc.data();
            subscription = {id, status};
        });

        return subscription;
    }

}

export default SubscriptionRepository;
