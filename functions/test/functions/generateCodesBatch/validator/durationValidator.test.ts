import {expect} from "chai";
import isValidDuration from "../../../../src/functions/generateCodesBatch/validator/durationValidator";

describe('Generates batch codes duration validation', function () {
    it('should be valid', function () {
        const validData = [1800, 3600, 7200, 10800, 86400]

        validData.forEach(duration => {
            const isValid = isValidDuration(duration);
            expect(isValid).to.eql(true)
        })
    });

    it('should not be valid', function () {
        const notValidData = [-1,0,1,1801, 3601, 86401]

        notValidData.forEach(duration => {
            const isValid = isValidDuration(duration);
            expect(isValid).to.eql(false)
        })
    });
});
