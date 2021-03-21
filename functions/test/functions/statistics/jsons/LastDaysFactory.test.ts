import {expect} from "chai";
import Statistic from "../../../../src/functions/statistics/repository/Statistic";
import {dummyDashboard, dummyStatistic} from "../dummyData";
import GlobalStatistics from "../../../../src/functions/statistics/GlobalStatistics";
import createLastDays from "../../../../src/functions/statistics/jsons/LastDaysFactory";

describe('LastDaysFactory tests', () => {
    it('should create lastDays data', async () => {

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

        const lastDaysJsonViewModel = createLastDays(statistic, dummyDashboard, globalStatistics);

        expect(lastDaysJsonViewModel).to.be.eql({
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
        });
    });

    it('should create empty lastDays data', async () => {

        const globalStatistics = {
            totalUndesirableReaction: 100,
            totalCases: 1,
            totalDeaths: 1,
            totalRecovered: 1,
            totalVaccinations: 1,
            totalVaccinationsDose1: 1,
            totalVaccinationsDose2: 1
        } as GlobalStatistics;

        const lastDaysJsonViewModel = createLastDays(null, dummyDashboard, globalStatistics);

        expect(lastDaysJsonViewModel).to.be.eql({
            cases: [],
            recovered: [],
            deaths: [],
            deathsWithComorbidities: [],
            deathsWithoutComorbidities: [],
            tests: [],
            vaccinations: [],
            vaccinationsDose1: [],
            vaccinationsDose2: [],
            undesirableReactions: []
        });
    });

    it('should create lastDays data with cutting to limit', async () => {

        const statistic = {
            ...dummyStatistic,
            details : {
                ...dummyStatistic.details,
                lastDays: {
                    cases: [12,3,1,2,3,4,5,6,7,8,9,10,1,1],
                    recovered: [45,3,1,2,3,4,5,6,7,8,9,10,1,1],
                    deaths: [12,4,1,2,3,4,5,6,7,8,9,10,1,1],
                    deathsWithComorbidities: [54,76,1,2,3,4,5,6,7,8,9,10,1,1],
                    deathsWithoutComorbidities: [76,4,1,2,3,4,5,6,7,8,9,10,1,1],
                    tests: [32,1,2,3,4,5,6,7,8,9,10,1,1,3],
                    vaccinations: [433,54,31,2,3,4,5,6,7,8,9,10,1,1],
                    vaccinationsDose1: [21,3,41,2,3,4,5,6,7,8,9,10,1,1],
                    vaccinationsDose2: [1,1,2,3,4,5,6,7,8,9,10,1,1,32],
                    undesirableReactions: [11, 4,1,2,3,4,5,6,7,8,9,10,1,1]
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

        const lastDaysJsonViewModel = createLastDays(statistic, dummyDashboard, globalStatistics);

        expect(lastDaysJsonViewModel).to.be.eql({
            cases: [3,1,2,3,4,5,6,7,8,9,10,1,1,1112],
            recovered: [3,1,2,3,4,5,6,7,8,9,10,1,1,1114],
            deaths: [4,1,2,3,4,5,6,7,8,9,10,1,1,1113],
            deathsWithComorbidities: [76,1,2,3,4,5,6,7,8,9,10,1,1,1115],
            deathsWithoutComorbidities: [4,1,2,3,4,5,6,7,8,9,10,1,1,1116],
            tests: [1,2,3,4,5,6,7,8,9,10,1,1,3,1117],
            vaccinations: [54,31,2,3,4,5,6,7,8,9,10,1,1,1118],
            vaccinationsDose1: [3,41,2,3,4,5,6,7,8,9,10,1,1,1119],
            vaccinationsDose2: [1,2,3,4,5,6,7,8,9,10,1,1,32,11110],
            undesirableReactions: [4,1,2,3,4,5,6,7,8,9,10,1,1,100]
        });
    });
});
