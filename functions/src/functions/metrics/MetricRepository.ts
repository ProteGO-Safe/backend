import EntityRepository from "./../repository/EntityRepository";
import Metric from "./Metric";

class MetricRepository extends EntityRepository {

    collectionName: string = 'metrics';

    async getTheOldestOne(): Promise<Metric | null> {

        const snapshot = await this.getCollection()
            .orderBy('createdAt', 'asc')
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs.map((item) => item.data() as Metric)[0];
    }
}

export default MetricRepository;
