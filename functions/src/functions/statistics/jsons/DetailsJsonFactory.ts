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

const createDetailsJson = (
    date: Date,
    voivodeships: Voivodeship[],
    districts: District[],
    districtsStatistics: DistrictStatistics[],
    voivodeshipsStatistics: VoivodeshipStatistics[],
    lastStatistics: Statistic[] | [],
    districtStates: Array<DistrictState>): DetailsJsonViewModel => {

    const timestamp = getTimestamp(date);

    const lastDays = (lastStatistics as [Statistic]).reduce((obj, item) => {

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
        .filter(district => districtsStatistics.map(districtStatistics => districtStatistics.districtId).includes(district.id))
        .map(district => {
            const state = districtStates.find(value => value.districtId === district.id)!.state;
            const districtStatistic = districtsStatistics.find(value => value.districtId === district.id)!;

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
        })
};

const createRegionDetails = (
    voivodeshipId: string,
    voivodeshipsStatistics: VoivodeshipStatistics[]): RegionDetailsViewModel => {
    const voivodeshipStatistics = voivodeshipsStatistics.find(value => value.voivodeshipId === voivodeshipId)!;
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
