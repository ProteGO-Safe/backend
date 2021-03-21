import {expect} from "chai";
import fetchLastDaysData from "../../../src/functions/statistics/LastDaysDataProcessor";

describe('LastDaysDataProcessor tests', () => {
    it('should fetch last days with limit', async () => {
        const fileContent = 'cases;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'covered;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'recovered;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'deaths;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'deathsWithComorbidities;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'deathsWithoutComorbidities;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'tests;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'vaccinations;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'vaccinationsDose1;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'vaccinationsDose2;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16\n' +
            'undesirableReactions;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16';


        const lastDays = await fetchLastDaysData(fileContent);

        expect(lastDays).to.be.eql({
            cases: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            recovered: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            deaths: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            deathsWithComorbidities: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            deathsWithoutComorbidities: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            tests: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            vaccinations: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            vaccinationsDose1: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            vaccinationsDose2: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            undesirableReactions: [3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        });
    });

    it('should fetch last days less than limit', async () => {
        const fileContent = 'cases;9;10;11;12;13;14;15;16\n' +
            'covered;9;10;11;12;13;14;15;16\n' +
            'recovered;9;10;11;12;13;14;15;16\n' +
            'deaths;9;10;11;12;13;14;15;16\n' +
            'deathsWithComorbidities;9;10;11;12;13;14;15;16\n' +
            'deathsWithoutComorbidities;9;10;11;12;13;14;15;16\n' +
            'tests;9;10;11;12;13;14;15;16\n' +
            'vaccinations;9;10;11;12;13;14;15;16\n' +
            'vaccinationsDose1;9;10;11;12;13;14;15;16\n' +
            'vaccinationsDose2;9;10;11;12;13;14;15;16\n' +
            'undesirableReactions;9;10;11;12;13;14;15;16';


        const lastDays = await fetchLastDaysData(fileContent);

        expect(lastDays).to.be.eql({
            cases: [9,10,11,12,13,14,15,16],
            recovered: [9,10,11,12,13,14,15,16],
            deaths: [9,10,11,12,13,14,15,16],
            deathsWithComorbidities: [9,10,11,12,13,14,15,16],
            deathsWithoutComorbidities: [9,10,11,12,13,14,15,16],
            tests: [9,10,11,12,13,14,15,16],
            vaccinations: [9,10,11,12,13,14,15,16],
            vaccinationsDose1: [9,10,11,12,13,14,15,16],
            vaccinationsDose2: [9,10,11,12,13,14,15,16],
            undesirableReactions: [9,10,11,12,13,14,15,16],
        });
    });
});
