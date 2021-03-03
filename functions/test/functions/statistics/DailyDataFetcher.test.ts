import {expect} from "chai";
import fetchDailyData from "../../../src/functions/statistics/DailyDataFetcher";

describe('DailyDataFetcher tests', () => {
    it('should fetch daily data', async () => {

        const districtsStatistics = [
            {
                districtId: "d1",
                voivodeshipId: "v1",
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                newDeathsWithComorbidities: 4,
                newDeathsWithoutComorbidities: 5,
                newTests: 6,
                newVaccinations: 7,
                newVaccinationsDose1: 8,
                newVaccinationsDose2: 9,
                totalVaccinations: 10,
                totalVaccinationsDose1: 11,
                totalVaccinationsDose2: 12,
            },
            {
                districtId: "d1",
                voivodeshipId: "v1",
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                newDeathsWithComorbidities: 4,
                newDeathsWithoutComorbidities: 5,
                newTests: 6,
                newVaccinations: 7,
                newVaccinationsDose1: 8,
                newVaccinationsDose2: 9,
                totalVaccinations: 10,
                totalVaccinationsDose1: 11,
                totalVaccinationsDose2: 12,
            }];

        const dailyData = fetchDailyData(districtsStatistics);

        expect(dailyData).to.be.eql({
            newCases: 2,
            newDeaths: 4,
            newRecovered: 6,
            newDeathsWithComorbidities: 8,
            newDeathsWithoutComorbidities: 10,
            newTests: 12,
            newVaccinations: 14,
            newVaccinationsDose1: 16,
            newVaccinationsDose2: 18
        });
    });
});
