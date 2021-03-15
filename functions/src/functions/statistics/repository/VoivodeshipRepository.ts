import EntityRepository from "../../repository/EntityRepository";
import Voivodeship from "./Voivodeship";

class VoivodeshipRepository extends EntityRepository {

    collectionName: string = 'voivodeships';

    async listAll(): Promise<Array<Voivodeship>> {

        const snapshot = await this.getCollection()
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((item) => item.data() as Voivodeship);
    }

    async fetchByName(name: string): Promise<Voivodeship | null> {

        const snapshot = await this.getCollection()
            .where("name", "==", name)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs.map((item) => item.data() as Voivodeship)[0];
    }
}

export default VoivodeshipRepository;
