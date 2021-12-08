import {expect} from 'chai';
import NumberFormatError from '../../../src/functions/statistics/errors/NumberFormatError';
import {parseNumber} from "../../../src/functions/statistics/StatistiscHelper";

describe('NumberFormatError tests', () => {
    it('should get number from text', () => {
        const number = parseNumber("12", "file.xsl", "field-name");

        expect(number).to.be.eq(12);
    });

    it('should get floating point number from text', () => {
        const number = parseNumber("12.1", "file.xsl", "field-name");

        expect(number).to.be.eq(12);
    });

    it('should throw exception when number is text', () => {
        const testedFunction = () => parseNumber("eqeqweq", "file.xsl", "field-name");
        expect(testedFunction).to.throw(NumberFormatError);
        expect(testedFunction).to.throw("invalid number: eqeqweq in the field: field-name in the file name: file.xsl");
    });

    it('should throw exception when number is empty', () => {
        const testedFunction = () => parseNumber("", "file.xsl", "field-name");
        expect(testedFunction).to.throw(NumberFormatError);
        expect(testedFunction).to.throw("invalid number:  in the field: field-name in the file name: file.xsl");
    });
});
