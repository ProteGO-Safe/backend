import Statistic from "../repository/Statistic";
import DashboardJsonViewModel from "../model/DashboardJsonViewModel";
import LastDaysJsonViewModel from "../model/LastDaysJsonViewModel";
import GlobalStatistics from "../GlobalStatistics";
import config from "../../../config";

const createLastDays = (
    lastStatistic: Statistic | null,
    dashboardJson: DashboardJsonViewModel,
    globalStatistics: GlobalStatistics): LastDaysJsonViewModel => {
    if (!lastStatistic) {
        return {
            cases: [],
            recovered: [],
            deaths: [],
            deathsWithComorbidities: [],
            deathsWithoutComorbidities: [],
            tests: [],
            vaccinations: [],
            vaccinationsDose1: [],
            vaccinationsDose2: [],
            undesirableReactions: [],
        }
    }

    const lastDays: LastDaysJsonViewModel = lastStatistic.details.lastDays;

    lastDays.cases = [...lastDays.cases, dashboardJson.newCases].slice(0-config.statistics.lastDaysDetails);
    lastDays.recovered = [...lastDays.recovered, dashboardJson.newRecovered].slice(0-config.statistics.lastDaysDetails);
    lastDays.deaths = [...lastDays.deaths, dashboardJson.newDeaths].slice(0-config.statistics.lastDaysDetails);
    lastDays.deathsWithComorbidities = [...lastDays.deathsWithComorbidities, dashboardJson.newDeathsWithComorbidities].slice(0-config.statistics.lastDaysDetails);
    lastDays.deathsWithoutComorbidities = [...lastDays.deathsWithoutComorbidities, dashboardJson.newDeathsWithoutComorbidities].slice(0-config.statistics.lastDaysDetails);
    lastDays.tests = [...lastDays.tests, dashboardJson.newTests].slice(0-config.statistics.lastDaysDetails);
    lastDays.vaccinations = [...lastDays.vaccinations, dashboardJson.newVaccinations].slice(0-config.statistics.lastDaysDetails);
    lastDays.vaccinationsDose1 = [...lastDays.vaccinationsDose1, dashboardJson.newVaccinationsDose1].slice(0-config.statistics.lastDaysDetails);
    lastDays.vaccinationsDose2 = [...lastDays.vaccinationsDose2, dashboardJson.newVaccinationsDose2].slice(0-config.statistics.lastDaysDetails);
    lastDays.undesirableReactions = [...lastDays.undesirableReactions, globalStatistics.totalUndesirableReaction].slice(0-config.statistics.lastDaysDetails);

    return lastDays
};

export default createLastDays;
