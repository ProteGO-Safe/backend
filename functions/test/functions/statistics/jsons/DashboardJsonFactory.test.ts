import {expect} from "chai";
import createDashboardJson from "../../../../src/functions/statistics/jsons/DashboardJsonFactory";

describe('DashboardJsonFactory tests', () => {
    it('should fetch dashboard data', async () => {

        const date = new Date('2021-02-01T11:23:32');

        const dailyData = {
            newCases: 1,
            newDeaths: 2,
            newRecovered: 3,
            newDeathsWithComorbidities: 4,
            newDeathsWithoutComorbidities: 5,
            newTests: 6,
            newVaccinations: 7,
            newVaccinationsDose1: 8,
            newVaccinationsDose2: 9
        };

        const globalStatistics = {
            totalCases: 10,
            totalDeaths: 11,
            totalRecovered: 12,
            totalVaccinations: 13,
            totalVaccinationsDose1: 14,
            totalVaccinationsDose2: 15,
            totalUndesirableReaction: 16,
        };

        const dashboardJson = createDashboardJson(date, dailyData, globalStatistics);

        expect(dashboardJson).to.be.eql({
            newCases: 1,
            newDeaths: 2,
            newDeathsWithComorbidities: 4,
            newDeathsWithoutComorbidities: 5,
            newRecovered: 3,
            newTests: 6,
            newVaccinations: 7,
            newVaccinationsDose1: 8,
            newVaccinationsDose2: 9,
            totalCases: 10,
            totalDeaths: 11,
            totalRecovered: 12,
            totalUndesirableReaction: 16,
            totalVaccinations: 13,
            totalVaccinationsDose1: 14,
            totalVaccinationsDose2: 15,
            updated: 1612178612,
        });
    });
});
