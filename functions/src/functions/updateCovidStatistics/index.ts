import {covidStatisticsRepository, statisticsReader} from "../../services";
import {logger} from "firebase-functions";
import {log} from "firebase-functions/lib/logger";
import sendStatisticsNotification from "../notification/sendStatisticsNotification";

const updateCovidStatistics = async () => {
    const covidStatistics = await covidStatisticsRepository.getCovidStats();
    const newestStatistics = await statisticsReader.getLastStatistics();

    log(`Read current saved covid statistics`, covidStatistics);
    log(`Read newest covid statistics`, newestStatistics);

    if (covidStatistics.updated && newestStatistics.updated && covidStatistics.updated >= newestStatistics.updated) {
        logger.info('Nothing to update.');
        return;
    }

    await covidStatisticsRepository.save(newestStatistics);
    log('Saved new statistics to the bucket');

    await sendStatisticsNotification(newestStatistics);
    log('Pushed notification');
}

export default updateCovidStatistics;
