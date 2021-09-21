import {dateToFormattedDayMonth, getJoinedDateAsString, getTimestamp, isToday} from "../../src/utils/dateUtils";
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

    it('should convert date to oneline date with leading zeros', () => {
        process.env.TZ = 'Europe/Warsaw';
        const dateString = getJoinedDateAsString(new Date(1615161642 * 1000));
        expect(dateString).to.be.eq("20210308");
    });

    it('should convert date to oneline date without leading zeros', () => {
        process.env.TZ = 'Europe/Warsaw';
        const dateString = getJoinedDateAsString(new Date(1639785642 * 1000));
        expect(dateString).to.be.eq("20211218");
    });

    it('should create timestamp as integer', () => {
        process.env.TZ = 'Europe/Warsaw';
        const date = new Date(1639785643.123 * 1000);
        const dateString = getTimestamp(date);
        expect(dateString).to.be.eq(1639785643);
    });

    it('should check that date is today', () => {
        process.env.TZ = 'Europe/Warsaw';
        const date = new Date();
        const isTodayValue = isToday(date);
        expect(isTodayValue).to.be.eq(true);
    });

    it('should check that date is not today', () => {
        process.env.TZ = 'Europe/Warsaw';
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const isTodayValue = isToday(date);
        expect(isTodayValue).to.be.eq(false);
    });


});
