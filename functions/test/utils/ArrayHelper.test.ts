import ArrayHelper from "../../src/utils/ArrayHelper";
import {expect} from 'chai';

describe('ArrayHelper tests', () => {
    it('chunks array', () => {
        const data = {
            array: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            chunkSize: 2,
            expectedChunks: 5
        }

        const chunkedArray = ArrayHelper.chunkArray(data.array, data.chunkSize);

        expect(chunkedArray.length).to.be.eq(data.expectedChunks);
    });

    it('flats array', () => {
        const data = [[1, 2, 3], [4, 5], [6, 7, 8], [9]];

        const flattenArray = ArrayHelper.flatArray(data);

        expect(flattenArray).to.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    })
});
