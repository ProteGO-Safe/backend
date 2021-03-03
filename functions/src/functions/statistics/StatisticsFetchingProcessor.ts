import fetchDistrictsStatistics from "./DistrictStatisticsProcessor";
import fetchGlobalStatistics from "./GlobalStatisticsProcessor";
import logError from "../logger/error";
import {districtRepository, statisticsFileReader, statisticsRepository, voivodeshipRepository} from "./services";
import FileNotFoundError from "./errors/FileNotFoundError";
import createCovidInfo from "./jsons/CovidInfoJsonFactory";
import {createStatistic} from "./StatisticFactory";

import fetchDistrictsStates from "./DistrictsStatesProcessor";
import createDashboardJson from "./jsons/DashboardJsonFactory";
import createDetailsJson from "./jsons/DetailsJsonFactory";
import config from "../../config";
import {notNull} from "../../utils/AssertHelper";
import fetchDailyData from "./DailyDataFetcher";
import createDistrictsJson from "./jsons/DistrictsJsonFactory";

const {log} = require("firebase-functions/lib/logger");


const processFetchingStatistics = async () => {

    const now = new Date();
    now.setMilliseconds(0);
    const midnight = new Date(now);
    midnight.setHours(0,0,0,0);

    const existingStatistic = await statisticsRepository.fetchByDate(midnight);

    if (existingStatistic) {
        log(`statistic for date: ${midnight} already exist`);
        return;
    }

    log(`started process fetching statistics for date: ${midnight}`);

    const districts = await districtRepository.listAll();
    const voivodeships = await voivodeshipRepository.listAll();
    const lastStatistic = await statisticsRepository.fetchLast();
    const lastStatistics = await statisticsRepository.listLastWithLimit(config.statistics.lastDaysDetails);

    notNull(lastStatistic);

    try {
        const rcbDistrictsFileContent = await statisticsFileReader.readRcbDistrictsFileContentByDate(midnight);
        const rcbDistrictVaccinationsFileContent = await statisticsFileReader.readRcbDistrictVaccinationsFileContentByDate(midnight);
        const rcbGlobalFileContent = await statisticsFileReader.readRcbGlobalFileContentByDate(midnight);
        const rcbGlobalVaccinationsFileContent = await statisticsFileReader.readRcbGlobalVaccinationsFileContentByDate(midnight);
        const rcbGlobalVaccinationsOtherFileContent = await statisticsFileReader.readRcbGlobalVaccinationsOtherFileContentByDate(midnight);
        const districtStatesFileContent = await statisticsFileReader.readDistrictStatesFileContentByDate(midnight);

        const districtsStatistics = await fetchDistrictsStatistics(districts, rcbDistrictsFileContent, rcbDistrictVaccinationsFileContent);
        const globalStatistics = await fetchGlobalStatistics(rcbGlobalFileContent, rcbGlobalVaccinationsFileContent, rcbGlobalVaccinationsOtherFileContent);
        const districtStates = await fetchDistrictsStates(districts, districtStatesFileContent, lastStatistic!);

        const dailyData = fetchDailyData(districtsStatistics);

        const covidInfoJson = createCovidInfo(now, dailyData, globalStatistics, voivodeships, districts, districtStates, lastStatistic!);
        const dashboardJson = createDashboardJson(now, dailyData, globalStatistics);
        const detailsJson = createDetailsJson(now, voivodeships, districts, districtsStatistics, lastStatistics, districtStates);
        const districtsJson = createDistrictsJson(now, voivodeships, districts, districtStates, lastStatistic);

        const statistic = createStatistic(midnight, covidInfoJson, dashboardJson, detailsJson, districtsJson, dailyData);
        await statisticsRepository.save(statistic);

    } catch (e) {
        if(e instanceof FileNotFoundError) {
            log(e.message);
        } else {
            logError('Error during create statistics');
            throw e;
        }
    }

    log(`finished process fetching statistics for date: ${midnight}`);
};

export default processFetchingStatistics;