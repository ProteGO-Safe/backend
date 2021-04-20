import {expect} from "chai";
import createDetailsJson from "../../../../src/functions/statistics/jsons/DetailsJsonFactory";
import Voivodeship from "../../../../src/functions/statistics/repository/Voivodeship";
import District from "../../../../src/functions/statistics/repository/District";
import DistrictState from "../../../../src/functions/statistics/DistrictState";
import DistrictStatistics from "../../../../src/functions/statistics/DistrictStatistics";
import Statistic from "../../../../src/functions/statistics/repository/Statistic";
import {dummyDashboard, dummyStatistic} from "../dummyData";
import VoivodeshipStatistics from "../../../../src/functions/statistics/VoivodeshipStatistics";
import GlobalStatistics from "../../../../src/functions/statistics/GlobalStatistics";

describe('DetailsJsonFactory tests', () => {
    it('should fetch details data', async () => {

        const date = new Date('2021-02-01T11:23:32');

        const voivodeships = [
            {
                id: "vid1",
                externalId: "veid1",
                uiId: 1,
                name: "n1",
            },
            {
                id: "vid2",
                externalId: "veid2",
                uiId: 2,
                name: "n2",
            }] as Voivodeship[];
        const districts = [
            {
                id: "did1",
                externalId: "deid1",
                voivodeshipId: "vid1",
                uiId: 2,
                name: "n1"
            },
            {
                id: "did2",
                externalId: "deid2",
                voivodeshipId: "vid1",
                uiId: 3,
                name: "n2"
            },
            {
                id: "did3",
                externalId: "deid2",
                voivodeshipId: "vid2",
                uiId: 4,
                name: "n3"
            }
        ] as District[];
        const districtStates = [
            {
                districtId: "did1",
                state: 1
            },
            {
                districtId: "did2",
                state: 2
            },
            {
                districtId: "did3",
                state: 3
            }
        ] as DistrictState[];

        const voivodeshipsStatistics = [
            {
                voivodeshipId: "vid1",
                newCases: 223,
                newDeaths: 224,
                newRecovered: 225,
                newDeathsWithComorbidities: 226,
                newDeathsWithoutComorbidities: 227,
                newTests: 228,
                newVaccinations: 229,
                newVaccinationsDose1: 230,
                newVaccinationsDose2: 231,
                totalVaccinations: 232,
                totalVaccinationsDose1: 233,
                totalVaccinationsDose2: 234,
            },
            {
                voivodeshipId: "vid2",
                newCases: 243,
                newDeaths: 244,
                newRecovered: 245,
                newDeathsWithComorbidities: 246,
                newDeathsWithoutComorbidities: 247,
                newTests: 248,
                newVaccinations: 249,
                newVaccinationsDose1: 250,
                newVaccinationsDose2: 251,
                totalVaccinations: 252,
                totalVaccinationsDose1: 253,
                totalVaccinationsDose2: 254,
            }
        ] as VoivodeshipStatistics[];

        const districtsStatistics = [
            {
                districtId: "did1",
                voivodeshipId: "vid1",
                newCases: 123,
                newDeaths: 124,
                newRecovered: 125,
                newDeathsWithComorbidities: 126,
                newDeathsWithoutComorbidities: 127,
                newTests: 128,
                newVaccinations: 129,
                newVaccinationsDose1: 130,
                newVaccinationsDose2: 131,
                totalVaccinations: 132,
                totalVaccinationsDose1: 133,
                totalVaccinationsDose2: 134,
            },
            {
                districtId: "did2",
                voivodeshipId: "vid1",
                newCases: 143,
                newDeaths: 144,
                newRecovered: 145,
                newDeathsWithComorbidities: 146,
                newDeathsWithoutComorbidities: 147,
                newTests: 148,
                newVaccinations: 149,
                newVaccinationsDose1: 150,
                newVaccinationsDose2: 151,
                totalVaccinations: 152,
                totalVaccinationsDose1: 153,
                totalVaccinationsDose2: 154,
            },
            {
                districtId: "did3",
                voivodeshipId: "vid2",
                newCases: 163,
                newDeaths: 164,
                newRecovered: 165,
                newDeathsWithComorbidities: 166,
                newDeathsWithoutComorbidities: 167,
                newTests: 168,
                newVaccinations: 169,
                newVaccinationsDose1: 170,
                newVaccinationsDose2: 171,
                totalVaccinations: 172,
                totalVaccinationsDose1: 173,
                totalVaccinationsDose2: 174,
            }
        ] as DistrictStatistics[];

        const statistic = {
            ...dummyStatistic,
            details : {
                ...dummyStatistic.details,
                lastDays: {
                    cases: [12,3],
                    recovered: [45,3],
                    deaths: [12,4],
                    deathsWithComorbidities: [54,76],
                    deathsWithoutComorbidities: [76,4],
                    tests: [32],
                    vaccinations: [433,54,3],
                    vaccinationsDose1: [21,3,4],
                    vaccinationsDose2: [1],
                    undesirableReactions: [11, 4]
                }
            }
        } as Statistic;

        const globalStatistics = {
            totalUndesirableReaction: 100,
            totalCases: 1,
            totalDeaths: 1,
            totalRecovered: 1,
            totalVaccinations: 1,
            totalVaccinationsDose1: 1,
            totalVaccinationsDose2: 1
        } as GlobalStatistics;

        const dashboardJson = createDetailsJson(date, voivodeships, districts, districtsStatistics, voivodeshipsStatistics, statistic, districtStates, dummyDashboard, globalStatistics);

        expect(dashboardJson).to.be.eql({
            lastDays: {
                cases: [12,3,1112],
                recovered: [45,3,1114],
                deaths: [12,4,1113],
                deathsWithComorbidities: [54,76,1115],
                deathsWithoutComorbidities: [76,4,1116],
                tests: [32,1117],
                vaccinations: [433,54,3,1118],
                vaccinationsDose1: [21,3,4,1119],
                vaccinationsDose2: [1,11110],
                undesirableReactions: [11, 4, 100]
            },
            updated: 1612178612,
            voivodeships: [{
                districts: [
                    {
                        id: "did1",
                        uiId: 2,
                        name: "n1",
                        newCases: 123,
                        newDeaths: 124,
                        newDeathsWithComorbidities: 126,
                        newDeathsWithoutComorbidities: 127,
                        newRecovered: 125,
                        newTests: 128,
                        newVaccinations: 129,
                        newVaccinationsDose1: 130,
                        newVaccinationsDose2: 131,
                        state: 1,
                        totalVaccinations: 132,
                        totalVaccinationsDose1: 133,
                        totalVaccinationsDose2: 134
                    },
                    {
                        id: "did2",
                        uiId: 3,
                        name: "n2",
                        newCases: 143,
                        newDeaths: 144,
                        newDeathsWithComorbidities: 146,
                        newDeathsWithoutComorbidities: 147,
                        newRecovered: 145,
                        newTests: 148,
                        newVaccinations: 149,
                        newVaccinationsDose1: 150,
                        newVaccinationsDose2: 151,
                        state: 2,
                        totalVaccinations: 152,
                        totalVaccinationsDose1: 153,
                        totalVaccinationsDose2: 154
                    }
                ],
                details: {
                    newCases: 223,
                    newDeaths: 224,
                    newDeathsWithComorbidities: 226,
                    newDeathsWithoutComorbidities: 227,
                    newRecovered: 225,
                    newTests: 228,
                    newVaccinations: 229,
                    newVaccinationsDose1: 230,
                    newVaccinationsDose2: 231,
                    totalVaccinations: 232,
                    totalVaccinationsDose1: 233,
                    totalVaccinationsDose2: 234
                },
                id: "vid1",
                name: "n1"
            },
                {
                    districts: [
                        {
                            id: "did3",
                            uiId: 4,
                            name: "n3",
                            newCases: 163,
                            newDeaths: 164,
                            newDeathsWithComorbidities: 166,
                            newDeathsWithoutComorbidities: 167,
                            newRecovered: 165,
                            newTests: 168,
                            newVaccinations: 169,
                            newVaccinationsDose1: 170,
                            newVaccinationsDose2: 171,
                            state: 3,
                            totalVaccinations: 172,
                            totalVaccinationsDose1: 173,
                            totalVaccinationsDose2: 174,
                        }
                    ],
                    details: {
                        newCases: 243,
                        newDeaths: 244,
                        newDeathsWithComorbidities: 246,
                        newDeathsWithoutComorbidities: 247,
                        newRecovered: 245,
                        newTests: 248,
                        newVaccinations: 249,
                        newVaccinationsDose1: 250,
                        newVaccinationsDose2: 251,
                        totalVaccinations: 252,
                        totalVaccinationsDose1: 253,
                        totalVaccinationsDose2: 254
                    },
                    id: "vid2",
                    name: "n2"
                }]
        });
    });
});
