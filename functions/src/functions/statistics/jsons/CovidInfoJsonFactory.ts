import GlobalStatistics from "../GlobalStatistics";
import CovidInfoJsonViewModel from "../model/CovidInfoJsonViewModel";
import {getTimestamp} from "../../../utils/dateUtils";
import Voivodeship from "../repository/Voivodeship";
import District from "../repository/District";
import DistrictState from "../DistrictState";
import Statistic from "../repository/Statistic";
import checkExistsNewestData from "./DataChangeChecker";
import DailyData from "../DailyData";
import createVoivodeships from "./VoivodeshipViewModelFactory";

const createCovidInfoJson = (
    date: Date,
    dailyData: DailyData,
    globalStatistics: GlobalStatistics,
    voivodeships: Voivodeship[],
    districts: District[],
    districtStates: DistrictState[],
    lastStatistic: Statistic | null,
): CovidInfoJsonViewModel => {

    const timestamp = getTimestamp(date);
    const createdVoivodeships = createVoivodeships(voivodeships, districts, districtStates);

    const covidStats = {
        updated: timestamp,
        newCases: dailyData.newCases,
        totalCases: globalStatistics.totalCases,
        newDeaths: dailyData.newDeaths,
        totalDeaths: globalStatistics.totalDeaths,
        newRecovered: dailyData.newRecovered,
        totalRecovered: globalStatistics.totalRecovered,
        newVaccinations: dailyData.newVaccinations,
        totalVaccinations: globalStatistics.totalVaccinations,
        newVaccinationsDose1: dailyData.newVaccinationsDose1,
        totalVaccinationsDose1: globalStatistics.totalVaccinationsDose1,
        newVaccinationsDose2: dailyData.newVaccinationsDose2,
        totalVaccinationsDose2: globalStatistics.totalVaccinationsDose2
    };

    const existsNewestData = checkExistsNewestData(createdVoivodeships, lastStatistic);

    if (existsNewestData) {
        return {
            updated: timestamp,
            voivodeshipsUpdated: timestamp,
            covidStats,
            voivodeships: createdVoivodeships
        }
    }

    return {
        updated: lastStatistic!.covidInfo.updated,
        voivodeshipsUpdated: lastStatistic!.covidInfo.voivodeshipsUpdated,
        covidStats,
        voivodeships: lastStatistic!.covidInfo.voivodeships
    }
};

export default createCovidInfoJson;
