import {dateToFormattedDayMonth} from "../../src/utils/dateUtils";
import {expect} from 'chai';

describe('dateUtils tests', () => {
    it('should convert timestamp to day and month with leading 0', () => {
        const dateString = dateToFormattedDayMonth(new Date(1610112455 * 1000));

        expect(dateString).to.be.eq("08.01");
    });

    it('should convert timestamp to day and month without leading 0', () => {
        const dateString = dateToFormattedDayMonth(new Date(1606712455 * 1000));

        expect(dateString).to.be.eq("30.11");
    });
});
