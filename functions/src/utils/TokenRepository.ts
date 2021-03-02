import moment = require("moment");
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import {firestore} from "firebase-admin/lib/firestore";

abstract class TokenRepository {
    async removeExpired(): Promise<void> {
        await this.getCollection()
            .where(this.deleteTimeFieldName(), '<', moment().unix())
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => {
                this.onRemoved(doc);

                return doc.ref.delete();
            }))
            .catch(reason => {
                throw new Error(reason);
            });

        await this.getCollection()
            .where(this.deleteTimeFieldName(), '==', null)
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => {
                this.onRemoved(doc);

                return doc.ref.delete();
            }))
            .catch(reason => {
                throw new Error(reason);
            }); 
    }

    abstract getCollection(): FirebaseFirestore.CollectionReference;

    abstract deleteTimeFieldName(): string;

    abstract onRemoved(doc: QueryDocumentSnapshot<DocumentData>): void;
}

export default TokenRepository;
