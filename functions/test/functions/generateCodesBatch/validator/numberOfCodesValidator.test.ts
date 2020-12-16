import {expect} from "chai";
import isValidNumberOfCodes from "../../../../src/functions/generateCodesBatch/validator/numberOfCodesValidator";

describe('Generates batch codes numberOfCodes validation', function () {
    it('should be valid', function () {
        const validData = [1, 100, 500, 999]

        validData.forEach(numberOfCodes => {
            const isValid = isValidNumberOfCodes(numberOfCodes);
            expect(isValid).to.eql(true)
        })
    });

    it('should not be valid', function () {
        const validData = [-1, 0, 1001]

        validData.forEach(numberOfCodes => {
            const isValid = isValidNumberOfCodes(numberOfCodes);
            expect(isValid).to.eql(false)
        })
    });
});
