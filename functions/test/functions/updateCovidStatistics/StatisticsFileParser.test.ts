import {expect} from "chai";
import CovidStats from "../../../src/utils/CovidStats";
import {statisticsFileParser} from "../../../src/services";

describe('StatisticsFileParser tests', () => {
    it('parse statistics file content', async () => {
        const content = 'Liczba zakażonych,Liczba śmiertelnych,Liczba wyzdrowiałych,Dziś zakażonych,Dziś zmarło,Dziś wyzdrowiało,liczba zaszczepionych,dzis zaszczepionych,liczba zaszczepionych 1,dzis zaszczepionych 1,liczba zaszczepionych 2,dzis zaszczepionych 2\n' +
            '1202700,25397,938269,8594,143,10546,123,234,345,456,567,678';
        const filename = 'covid-stats/20201220_covid_stats.csv';

        const covidStats = await statisticsFileParser.parse(content, filename);

        expect(covidStats).to.be.eql(new CovidStats(
            1608422400,
            8594,
            1202700,
            143,
            25397,
            10546,
            938269,
            234,
            123,
            456,
            345,
            678,
            567
        ));
    });
    it('parse statistics file content for zero value', async () => {
        const content = 'Liczba zakażonych,Liczba śmiertelnych,Liczba wyzdrowiałych,Dziś zakażonych,Dziś zmarło,Dziś wyzdrowiało,liczba zaszczepionych,dzis zaszczepionych,liczba zaszczepionych 1,dzis zaszczepionych 1,liczba zaszczepionych 2,dzis zaszczepionych 2\n' +
            '1202700,25397,938269,8594,143,10546,123,234,345,456,0,0';
        const filename = 'covid-stats/20201220_covid_stats.csv';

        const covidStats = await statisticsFileParser.parse(content, filename);

        expect(covidStats).to.be.eql(new CovidStats(
            1608422400,
            8594,
            1202700,
            143,
            25397,
            10546,
            938269,
            234,
            123,
            456,
            345,
            0,
            0
        ));
    });
});
