import StatisticsReader from "../../../src/functions/updateCovidStatistics/StatisticsReader";
import {instance, mock, when} from "ts-mockito";
import StatisticsFileReader from "../../../src/functions/updateCovidStatistics/StatisticsFileReader";
import {expect} from "chai";
import CovidStats from "../../../src/utils/CovidStats";

describe('StatisticsReader tests', () => {
    it('reads last statistics as empty object', async () => {
        const
            fileReader: StatisticsFileReader = mock(StatisticsFileReader),
            reader = new StatisticsReader(instance(fileReader));

        when(fileReader.readLastNewCasesFile()).thenReturn(new Promise(resolve => resolve(null)));
        when(fileReader.readLastTotalCasesFile()).thenReturn(new Promise(resolve => resolve(null)));

        const lastStatistics = await reader.getLastStatistics();

        expect(lastStatistics.updated).to.be.eq(undefined);
    });

    it('reads last statistics', async () => {
        const
            fileReader: StatisticsFileReader = mock(StatisticsFileReader),
            reader = new StatisticsReader(instance(fileReader)),
            date = new Date(),
            contentNewCases = 'Wojew�dztwo;Liczba przypadk�w;Liczba na 10 tys. mieszka�c�w;Zgony;Zgony w wyniku COVID bez chor�b wsp�istniej�cych;Zgony w wyniku COVID i chor�b wsp�istniej�cych;TERYT\n' +
                'Ca�y kraj;8977,0;2;34;88;;t00\n',
            contentTotalCases = 'Sumaryczna ilo�� zaka�e� od pocz�tku pandemii;Sumaryczna ilo�� przypadk�w �miertelnych\n' +
                '1088346,0;111\n';

        when(fileReader.readLastNewCasesFile()).thenReturn(
            new Promise(resolve => resolve({date: date, content: contentNewCases}))
        );
        when(fileReader.readLastTotalCasesFile()).thenReturn(
            new Promise(resolve => resolve({date: date, content: contentTotalCases}))
        );

        const lastStatistics = await reader.getLastStatistics();

        expect(lastStatistics).to.be.eql(new CovidStats(
            date.getTime() / 1000,
            8977,
            1088346,
            88,
            111,
            null,
            null,
        ));
    });
});
