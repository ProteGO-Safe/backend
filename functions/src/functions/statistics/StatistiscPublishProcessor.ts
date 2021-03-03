import {getMinimumTimeToExecute} from "./StatistiscHelper";
import {statisticFileRepository, statisticsRepository} from "./services";
import {addDays, getTimestamp} from "../../utils/dateUtils";
import config from '../../config'
import Timestamps from "./Timestamps";

const {log} = require("firebase-functions/lib/logger");


const publishStatistics = async () => {

    const now = new Date();

    if (now < getMinimumTimeToExecute()) {
        return
    }

    const statistic = await statisticsRepository.fetchLast();

    if (!statistic) {
        log(`statistic doesn't exist`);
        return
    }

    if (statistic.published) {
        log(`statistic already has published`);
        return
    }

    log(`started publish timestamps data for date: ${now}`);

    const nextUpdate = parseInt(getTimestamp(addDays(now, 1)).toFixed(0));

    const timestamps = {
        nextUpdate,
        dashboardUpdated: statistic.dashboard.updated,
        detailsUpdated: statistic.details.updated,
        districtsUpdated: statistic.districts.updated,
    } as Timestamps;

    await statisticFileRepository.saveFile(statistic.dashboard, config.statistics.files.dashboard);
    await statisticFileRepository.saveFile(statistic.details, config.statistics.files.details);
    await statisticFileRepository.saveFile(statistic.districts, config.statistics.files.districts);
    await statisticFileRepository.saveFile(statistic.covidInfo, config.statistics.files.covidInfo);
    await statisticFileRepository.saveFile(timestamps, config.statistics.files.timestamps);

    statistic.published = true;

    await statisticsRepository.save(statistic);

    log(`finished publish timestamps data for date: ${now}, next update ${new Date(nextUpdate * 1000)}`);
};

export default publishStatistics;