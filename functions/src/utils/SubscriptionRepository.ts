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
}

export default SubscriptionRepository;
