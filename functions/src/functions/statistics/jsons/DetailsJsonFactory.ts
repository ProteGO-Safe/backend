import {getTimestamp} from "../../../utils/dateUtils";
import Voivodeship from "../repository/Voivodeship";
import District from "../repository/District";
import DetailsJsonViewModel from "../model/DetailsJsonViewModel";
import DistrictStatistics from "../DistrictStatistics";
import Statistic from "../repository/Statistic";
import DistrictState from "../DistrictState";
import DistrictDetailsViewModel from "../model/DistrictDetailsViewModel";
import VoivodeshipDetailsViewModel from "../model/VoivodeshipDetailsViewModel";
import RegionDetailsViewModel from "../model/RegionDetailsViewModel";
import VoivodeshipStatistics from "../VoivodeshipStatistics";
import DashboardJsonViewModel from "../model/DashboardJsonViewModel";
import LastDaysJsonViewModel from "../model/LastDaysJsonViewModel";

const createDetailsJson = (
    date: Date,
    voivodeships: Voivodeship[],
    districts: District[],
    districtsStatistics: DistrictStatistics[],
    voivodeshipsStatistics: VoivodeshipStatistics[],
    lastStatistics: Statistic[] | [],
    districtStates: Array<DistrictState>,
    dashboardJson: DashboardJsonViewModel): DetailsJsonViewModel => {

    const timestamp = getTimestamp(date);

    const lastDays: LastDaysJsonViewModel = (lastStatistics as [Statistic])
        .reduce((obj: any, item) => {

        return {
            cases: [...obj.cases, item.dashboard.newCases],
            recovered: [...obj.recovered, item.dashboard.newRecovered],
            deaths: [...obj.deaths, item.dashboard.newDeaths],
            deathsWithComorbidities: [...obj.deathsWithComorbidities, item.dashboard.newDeathsWithComorbidities],
            deathsWithoutComorbidities: [...obj.deathsWithoutComorbidities, item.dashboard.newDeathsWithoutComorbidities],
            tests: [...obj.tests, item.dashboard.newTests],
            vaccinations: [...obj.vaccinations, item.dashboard.newVaccinations],
            vaccinationsDose1: [...obj.vaccinationsDose1, item.dashboard.newVaccinationsDose1],
            vaccinationsDose2: [...obj.vaccinationsDose2, item.dashboard.newVaccinationsDose2],
        }

    }, {
        cases: [] as number[],
        recovered: [] as number[],
        deaths: [] as number[],
        deathsWithComorbidities: [] as number[],
        deathsWithoutComorbidities: [] as number[],
        tests: [] as number[],
        vaccinations: [] as number[],
        vaccinationsDose1: [] as number[],
        vaccinationsDose2: [] as number[],
    });

    lastDays.cases = [...lastDays.cases, dashboardJson.newCases];
    lastDays.recovered = [...lastDays.recovered, dashboardJson.newRecovered];
    lastDays.deaths = [...lastDays.deaths, dashboardJson.newDeaths];
    lastDays.deathsWithComorbidities = [...lastDays.deathsWithComorbidities, dashboardJson.newDeathsWithComorbidities];
    lastDays.deathsWithoutComorbidities = [...lastDays.deathsWithoutComorbidities, dashboardJson.newDeathsWithoutComorbidities];
    lastDays.tests = [...lastDays.tests, dashboardJson.newTests];
    lastDays.vaccinations = [...lastDays.vaccinations, dashboardJson.newVaccinations];
    lastDays.vaccinationsDose1 = [...lastDays.vaccinationsDose1, dashboardJson.newVaccinationsDose1];
    lastDays.vaccinationsDose2 = [...lastDays.vaccinationsDose2, dashboardJson.newVaccinationsDose2];

    return {
        updated: timestamp,
        voivodeships: createDetailsVoivodeships(voivodeships, districts, districtsStatistics, voivodeshipsStatistics, districtStates),
        lastDays
    }
};

const createDistricts = (
    voivodeshipId: string,
    districts: District[],
    districtsStatistics: DistrictStatistics[],
    districtStates: Array<DistrictState>): Array<DistrictDetailsViewModel> => {
    return districts
        .filter(district => district.voivodeshipId === voivodeshipId)
        .map(district => {
            const state = districtStates.find(value => value.districtId === district.id)!.state;
            const districtStatistic = districtsStatistics.find(value => value.districtId === district.id)!;

            if (districtStatistic) {
                return {
                    id: district.id,
                    name: district.name,
                    state,
                    newCases: districtStatistic.newCases,
                    newDeaths: districtStatistic.newDeaths,
                    newRecovered: districtStatistic.newRecovered,
                    newDeathsWithComorbidities: districtStatistic.newDeathsWithComorbidities,
                    newDeathsWithoutComorbidities: districtStatistic.newDeathsWithComorbidities,
                    newTests: districtStatistic.newTests,
                    newVaccinations: districtStatistic.newVaccinations,
                    newVaccinationsDose1: districtStatistic.newVaccinationsDose1,
                    newVaccinationsDose2: districtStatistic.newVaccinationsDose2,
                    totalVaccinations: districtStatistic.totalVaccinations,
                    totalVaccinationsDose1: districtStatistic.totalVaccinationsDose1,
                    totalVaccinationsDose2: districtStatistic.totalVaccinationsDose2,
                }
            }

            return {
                id: district.id,
                name: district.name,
                state,
                newCases: null,
                newDeaths: null,
                newRecovered: null,
                newDeathsWithComorbidities: null,
                newDeathsWithoutComorbidities: null,
                newTests: null,
                newVaccinations: null,
                newVaccinationsDose1: null,
                newVaccinationsDose2: null,
                totalVaccinations: null,
                totalVaccinationsDose1: null,
                totalVaccinationsDose2: null,
            }
        })
};

const createRegionDetails = (
    voivodeshipId: string,
    voivodeshipsStatistics: VoivodeshipStatistics[]): RegionDetailsViewModel => {
    const voivodeshipStatistics = voivodeshipsStatistics.find(value => value.voivodeshipId === voivodeshipId);

    if (voivodeshipStatistics) {
        return {
            newCases: voivodeshipStatistics.newCases,
            newDeaths: voivodeshipStatistics.newDeaths,
            newRecovered: voivodeshipStatistics.newRecovered,
            newDeathsWithComorbidities: voivodeshipStatistics.newDeathsWithComorbidities,
            newDeathsWithoutComorbidities: voivodeshipStatistics.newDeathsWithoutComorbidities,
            newTests: voivodeshipStatistics.newTests,
            newVaccinations: voivodeshipStatistics.newVaccinations,
            newVaccinationsDose1: voivodeshipStatistics.newVaccinationsDose1,
            newVaccinationsDose2: voivodeshipStatistics.newVaccinationsDose2,
            totalVaccinations: voivodeshipStatistics.totalVaccinations,
            totalVaccinationsDose1: voivodeshipStatistics.totalVaccinationsDose1,
            totalVaccinationsDose2: voivodeshipStatistics.totalVaccinationsDose2,
        }
    }
    return {
        newCases: null,
        newDeaths: null,
        newRecovered: null,
        newDeathsWithComorbidities: null,
        newDeathsWithoutComorbidities: null,
        newTests: null,
        newVaccinations: null,
        newVaccinationsDose1: null,
        newVaccinationsDose2: null,
        totalVaccinations: null,
        totalVaccinationsDose1: null,
        totalVaccinationsDose2: null,
    }
};

const createDetailsVoivodeships = (
    voivodeships: Voivodeship[],
    districts: District[],
    districtsStatistics: DistrictStatistics[],
    voivodeshipsStatistics: VoivodeshipStatistics[],
    districtStates: Array<DistrictState>): Array<VoivodeshipDetailsViewModel> => {
    return voivodeships.map(voivodeship => {
        return {
            id: voivodeship.id,
            name: voivodeship.name,
            details: createRegionDetails(voivodeship.id, voivodeshipsStatistics),
            districts: createDistricts(voivodeship.id, districts, districtsStatistics, districtStates)
        }
    })
};

export default createDetailsJson;
