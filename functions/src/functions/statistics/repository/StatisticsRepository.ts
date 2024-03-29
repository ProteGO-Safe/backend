import EntityRepository from "../../repository/EntityRepository";
import Statistic from "./Statistic";
import {getEndOfDay, getStartOfDay} from "../../../utils/dateUtils";

class StatisticsRepository extends EntityRepository {

    collectionName: string = 'statistics';

    private static createStatistic(data: any): any {
        return {
            ...data,
            date: data.date.toDate(),
        }
    }

    async getByTheSameDate(date: Date): Promise<Statistic | null> {

        const snapshot = await this.getCollection()
            .where('date', '>', getStartOfDay(date))
            .where('date', '<', getEndOfDay(date))
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs
            .map((item) => item.data())
            .map(StatisticsRepository.createStatistic)[0];
    }

    async fetchLast(): Promise<Statistic | null> {

        const snapshot = await this.getCollection()
            .orderBy("date", "desc")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs
            .map((item) => item.data())
            .map(StatisticsRepository.createStatistic)[0];
    }

    async listLastWithLimit(limit: number): Promise<Statistic[] | []> {

        const snapshot = await this.getCollection()
            .orderBy("date", "desc")
            .limit(limit)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs
            .map((item) => item.data())
            .map(StatisticsRepository.createStatistic);
    }
}

export default StatisticsRepository;
