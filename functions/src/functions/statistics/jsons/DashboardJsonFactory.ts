import GlobalStatistics from "../GlobalStatistics";
import {getTimestamp} from "../../../utils/dateUtils";
import DashboardJsonViewModel from "../model/DashboardJsonViewModel";
import DailyData from "../DailyData";

const createDashboardJson = (
    date: Date,
    dailyData: DailyData,
    globalStatistics: GlobalStatistics,
): DashboardJsonViewModel => {

    const timestamp = getTimestamp(date);

    return {
        updated: timestamp,
        newCases: dailyData.newCases,
        newDeaths: dailyData.newDeaths,
        newRecovered: dailyData.newRecovered,
        newDeathsWithComorbidities: dailyData.newDeathsWithComorbidities,
        newDeathsWithoutComorbidities: dailyData.newDeathsWithoutComorbidities,
        newTests: dailyData.newTests,
        newVaccinations: dailyData.newVaccinations,
        newVaccinationsDose1: dailyData.newVaccinationsDose1,
        newVaccinationsDose2: dailyData.newVaccinationsDose2,
        newUndesirableReaction: 0, // todo https://titans24.atlassian.net/browse/PSAFE-3496
        totalCases: globalStatistics.totalCases,
        totalDeaths: globalStatistics.totalDeaths,
        totalRecovered: globalStatistics.totalRecovered,
        totalVaccinations: globalStatistics.totalVaccinations,
        totalVaccinationsDose1: globalStatistics.totalVaccinationsDose1,
        totalVaccinationsDose2: globalStatistics.totalVaccinationsDose2,
        totalUndesirableReaction: globalStatistics.totalUndesirableReaction
    }
};

export default createDashboardJson;
