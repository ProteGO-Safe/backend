import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import {log} from "firebase-functions/lib/logger";
import {statisticsRepository} from "./services";
import fetchLastDaysData from "./LastDaysDataProcessor";
import {cdnFileRepository} from "../../services";

const FILE_NAME = "statistics_last_days.csv";

const insertStatisticsLastDaysData = async (metadata: ObjectMetadata) => {

    const fileName = metadata.name!;

    if (fileName !== FILE_NAME) {
        return;
    }

    const statistics = await statisticsRepository.fetchLast();

    if (!statistics) {
        log(`statistics not exists`);
        return;
    }

    log(`Start inserting last days data to statistics with date ${statistics.date} and id ${statistics.id}`);

    const fileContent = await cdnFileRepository.readFile("statistics_last_days.csv");

    statistics.details.lastDays = await fetchLastDaysData(fileContent);

    await statisticsRepository.save(statistics);

    log(`Finish inserting last days data`);
};

export default insertStatisticsLastDaysData;
