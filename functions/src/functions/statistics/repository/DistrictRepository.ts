import District from "./District";
import EntityRepository from "../../repository/EntityRepository";

class DistrictRepository extends EntityRepository {

    collectionName: string = 'districts';

    async getByName(districtName: string): Promise<District | null> {

        const snapshot = await this.getCollection()
            .where("name", "==", districtName)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        return snapshot.docs.map((item) => item.data() as District)[0];
    }

    async getById(id: string): Promise<District | null> {

        const snapshot = await this.getCollection().doc(id).get();

        return snapshot.data() as District;
    }

    async existsAny(): Promise<boolean> {

        const snapshot = await this.getCollection()
            .limit(1)
            .get();

        return !snapshot.empty;
    }

    async listAll(): Promise<Array<District> | []> {

        const snapshot = await this.getCollection().get();

        return snapshot.docs.map((item) => item.data() as District);
    }
}

export default DistrictRepository;
