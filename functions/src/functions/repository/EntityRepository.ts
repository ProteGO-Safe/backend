import * as admin from "firebase-admin";
import Entity from "./Entity";

abstract class EntityRepository {

    abstract collectionName = "";

    protected getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection(this.collectionName);
    }

    async save(entity: Entity) {

        this.getCollection()
            .doc(entity.id)
            .set(entity)
            .catch(reason => {
                throw new Error(reason)
            });
    }
}

export default EntityRepository;
