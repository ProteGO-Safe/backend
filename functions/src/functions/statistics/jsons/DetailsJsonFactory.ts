import {getTimestamp} from "../../../utils/dateUtils";
import Voivodeship from "../repository/Voivodeship";
import District from "../repository/District";
import DetailsJsonViewModel from "../model/DetailsJsonViewModel";
import DistrictStatistics from "../DistrictStatistics";
import Statistic from "../repository/Statistic";
import DistrictState from "../DistrictState";
import DistrictDetailsViewModel from "../model/DistrictDetailsViewModel";
import VoivodeshipDetailsViewModel from "../model/VoivodeshipDetailsViewModel";

const createDetailsJson = (
    date: Date,
    voivodeships: Voivodeship[],
    districts: District[],
    districtsStatistics: DistrictStatistics[],
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
            undesirableReactions: [...obj.undesirableReactions, item.dashboard.newUndesirableReaction],
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
        undesirableReactions: [] as number[],
    });

    return {
        updated: timestamp,
        voivodeships: createDetailsVoivodeships(voivodeships, districts, districtsStatistics, districtStates),
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
            const districtStatistic = districtsStatistics.find(value => value.districtId === district.id);

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
                    totalCases:  0, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                    totalDeaths:  0, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                    totalRecovered:  0, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                    totalVaccinations: districtStatistic.totalVaccinations,
                    totalVaccinationsDose1: districtStatistic.totalVaccinationsDose1,
                    totalVaccinationsDose2: districtStatistic.totalVaccinationsDose2,
                    totalUndesirableReaction: 0, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
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
                totalCases:  null, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                totalDeaths:  null, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                totalRecovered:  null, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
                totalVaccinations: null,
                totalVaccinationsDose1: null,
                totalVaccinationsDose2: null,
                totalUndesirableReaction: null, // todo https://titans24.atlassian.net/browse/PSAFE-3496,
            }
        })
};

const createDetailsVoivodeships = (
    voivodeships: Voivodeship[],
    districts: District[],
    districtsStatistics: DistrictStatistics[],
    districtStates: Array<DistrictState>): Array<VoivodeshipDetailsViewModel> => {
    return voivodeships.map(voivodeship => {
        return {
            id: voivodeship.id,
            name: voivodeship.name,
            districts: createDistricts(voivodeship.id, districts, districtsStatistics, districtStates)
        }
    })
};

export default createDetailsJson;
