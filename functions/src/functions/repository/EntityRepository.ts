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

    async delete(entityId: string) {
        await this.getCollection()
            .doc(entityId)
            .delete();
    }

    async getById(id: string): Promise<Entity | null> {

        const snapshot = await this.getCollection().doc(id).get();

        return snapshot.data() as Entity;
    }
}

export default EntityRepository;
