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
import NumberFormatError from "./errors/NumberFormatError";
import {Color} from "../colors";
import SlackMessage from "../slack/SlackMessage";
import sendSlackMessage from "../slack/SlackMessageSender";
import File from "./File";

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
        const rcbDistrictsFile: File = await statisticsFileReader.readRcbDistrictsFileByDate(now);
        const rcbDistrictVaccinationsFile: File = await statisticsFileReader.readRcbDistrictVaccinationsFileByDate(now);
        const rcbVoivodeshipsFile: File = await statisticsFileReader.readRcbVoivodeshipsFileByDate(now);
        const rcbVoivodeshipVaccinationsFile: File = await statisticsFileReader.readRcbVoivodeshipsVaccinationsFileByDate(now);
        const rcbGlobalFile: File = await statisticsFileReader.readRcbGlobalFileByDate(now);
        const rcbGlobalVaccinationsFile: File = await statisticsFileReader.readRcbGlobalVaccinationsFileByDate(now);
        const rcbGlobalVaccinationsOtherFile: File = await statisticsFileReader.readRcbGlobalVaccinationsOtherFileByDate(now);
        const districtStatesFile: File | null = await statisticsFileReader.readDistrictStatesFileByDate(now);

        const districtsStatistics = fetchDistrictsStatistics(districts, rcbDistrictsFile, rcbDistrictVaccinationsFile);
        const voivodeshipsStatistics = fetchVoivodeshipsStatistics(voivodeships, rcbVoivodeshipsFile, rcbVoivodeshipVaccinationsFile);
        const globalStatistics = fetchGlobalStatistics(rcbGlobalFile, rcbGlobalVaccinationsFile, rcbGlobalVaccinationsOtherFile);
        const districtStates = fetchDistrictsStates(districts, districtStatesFile, lastStatistic!);
        const dailyData = fetchDailyData(rcbDistrictsFile, rcbGlobalVaccinationsFile);

        const covidInfoJson = createCovidInfo(now, dailyData, globalStatistics, voivodeships, districts, districtStates, lastStatistic!);
        const dashboardJson = createDashboardJson(now, dailyData, globalStatistics);
        const detailsJson = createDetailsJson(now, voivodeships, districts, districtsStatistics, voivodeshipsStatistics, lastStatistic, districtStates, dashboardJson, globalStatistics);
        const districtsJson = createDistrictsJson(now, voivodeships, districts, districtStates, lastStatistic);

        const statistic = createStatistic(now, covidInfoJson, dashboardJson, detailsJson, districtsJson);
        await statisticsRepository.save(statistic);

    } catch (e) {
        if(e instanceof FileNotFoundError) {
            log(e.message);
        }
        else if (e instanceof NumberFormatError) {
            const slackMessage = {title: e.message, color: Color.RED, detailsItems: []} as SlackMessage;
            await sendSlackMessage(slackMessage);
            log(e.message);
        }
        else {
            logError('Error during create statistics');
            throw e;
        }
    }

    log(`finished process fetching statistics for date: ${now}`);
};

export default processFetchingStatistics;