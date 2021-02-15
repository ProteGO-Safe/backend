import {timestampToFormattedDayMonth} from "../../src/utils/dateUtils";
import {expect} from 'chai';

describe('dateUtils tests', () => {
    it('should convert timestamp to day and month with leading 0', () => {
        const dateString = timestampToFormattedDayMonth(1610112455);

        expect(dateString).to.be.eq("08.01");
    });

    it('should convert timestamp to day and month without leading 0', () => {
        const dateString = timestampToFormattedDayMonth(1606712455);

        expect(dateString).to.be.eq("30.11");
    });

    it('should convert undefined to current day and month', () => {
        const dateString = timestampToFormattedDayMonth(undefined);

        expect(dateString.length).to.be.eq(5);
    });

    it('should convert null to current day and month', () => {
        const dateString = timestampToFormattedDayMonth(null);

        expect(dateString.length).to.be.eq(5);
    });
});
