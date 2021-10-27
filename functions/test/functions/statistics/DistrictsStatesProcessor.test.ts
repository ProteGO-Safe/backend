import {expect} from "chai";
import fetchDistrictsStates from "../../../src/functions/statistics/DistrictsStatesProcessor";
import {dummyStatistic} from "./dummyData";
import File from "../../../src/functions/statistics/File";

const districts = [
    {
        id: "idd1",
        externalId: "t0201",
        voivodeshipId: "v1",
        uiId: 1,
        name: "bolesławiecki"
    },
    {
        id: "idd2",
        externalId: "t0202",
        voivodeshipId: "v1",
        uiId: 2,
        name: "dzierżoniowski"
    },
    {
        id: "idd3",
        externalId: "t0203",
        voivodeshipId: "v1",
        uiId: 2,
        name: "głogowski"
    }];

describe('DistrictsStatesProcessor tests', () => {
    it('should fetch districts states statistics', async () => {
        const districtStatesFileContent = 'wojewodztwo;powiat_miasto;teryt;strefa\n' +
            'dolnośląskie;bolesławiecki;t0201;2\n' +
            'dolnośląskie;dzierżoniowski;t0202;2\n' +
            'dolnośląskie;głogowski;t0203;2';

        const districtsStates = await fetchDistrictsStates(districts,
            new File("", districtStatesFileContent),
            dummyStatistic);

        expect(districtsStates).to.be.eql([
            {
                districtId: "idd1",
                state: 2
            },
            {
                districtId: "idd2",
                state: 2
            },
            {
                districtId: "idd3",
                state: 2
            }
        ]);
    });

    it('should fetch districts states statistics without file', async () => {
        const districtStatesFileContent = null;

        const districtsStates = await fetchDistrictsStates(districts, districtStatesFileContent, dummyStatistic);

        expect(districtsStates).to.be.eql([
            {
                districtId: "idd1",
                state: 1
            },
            {
                districtId: "idd2",
                state: 2
            },
            {
                districtId: "idd3",
                state: 3
            }
        ]);
    });
});
