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
import {notNull} from "../../utils/AssertHelper";
import fetchDailyData from "./DailyDataFetcher";
import createDistrictsJson from "./jsons/DistrictsJsonFactory";
import fetchVoivodeshipsStatistics from "./VoivodeshipStatisticsProcessor";

const {log} = require("firebase-functions/lib/logger");


const processFetchingStatistics = async () => {

    const now = new Date();

    const existingStatistic = await statisticsRepository.getByTheSameDate(now);

    if (existingStatistic) {
        log(`statistic for date: ${now} already exist`);
        return;
    }

    log(`started process fetching statistics for date: ${now}`);

    const districts = await districtRepository.listAll();
    const voivodeships = await voivodeshipRepository.listAll();
    const lastStatistic = await statisticsRepository.fetchLast();

    notNull(lastStatistic);

    try {
        const rcbDistrictsFileContent = await statisticsFileReader.readRcbDistrictsFileContentByDate(now);
        const rcbDistrictVaccinationsFileContent = await statisticsFileReader.readRcbDistrictVaccinationsFileContentByDate(now);
        const rcbVoivodeshipsFileContent = await statisticsFileReader.readRcbVoivodeshipsFileContentByDate(now);
        const rcbVoivodeshipVaccinationsFileContent = await statisticsFileReader.readRcbVoivodeshipsVaccinationsFileContentByDate(now);
        const rcbGlobalFileContent = await statisticsFileReader.readRcbGlobalFileContentByDate(now);
        const rcbGlobalVaccinationsFileContent = await statisticsFileReader.readRcbGlobalVaccinationsFileContentByDate(now);
        const rcbGlobalVaccinationsOtherFileContent = await statisticsFileReader.readRcbGlobalVaccinationsOtherFileContentByDate(now);
        const districtStatesFileContent = await statisticsFileReader.readDistrictStatesFileContentByDate(now);

        const districtsStatistics = await fetchDistrictsStatistics(districts, rcbDistrictsFileContent, rcbDistrictVaccinationsFileContent);
        const voivodeshipsStatistics = await fetchVoivodeshipsStatistics(voivodeships, rcbVoivodeshipsFileContent, rcbVoivodeshipVaccinationsFileContent);
        const globalStatistics = await fetchGlobalStatistics(rcbGlobalFileContent, rcbGlobalVaccinationsFileContent, rcbGlobalVaccinationsOtherFileContent);
        const districtStates = await fetchDistrictsStates(districts, districtStatesFileContent, lastStatistic!);
        const dailyData = await fetchDailyData(rcbDistrictsFileContent, rcbGlobalVaccinationsFileContent);

        const covidInfoJson = createCovidInfo(now, dailyData, globalStatistics, voivodeships, districts, districtStates, lastStatistic!);
        const dashboardJson = createDashboardJson(now, dailyData, globalStatistics);
        const detailsJson = createDetailsJson(now, voivodeships, districts, districtsStatistics, voivodeshipsStatistics, lastStatistic, districtStates, dashboardJson, globalStatistics);
        const districtsJson = createDistrictsJson(now, voivodeships, districts, districtStates, lastStatistic);

        const statistic = createStatistic(now, covidInfoJson, dashboardJson, detailsJson, districtsJson);
        await statisticsRepository.save(statistic);

    } catch (e) {
        if(e instanceof FileNotFoundError) {
            log(e.message);
        } else {
            logError('Error during create statistics');
            throw e;
        }
    }

    log(`finished process fetching statistics for date: ${now}`);
};

export default processFetchingStatistics;