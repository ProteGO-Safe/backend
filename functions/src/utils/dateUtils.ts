export const dateToFormattedDayMonth = (date: Date) => {
    return `${leadingZero(date.getDate())}.${leadingZero(date.getMonth() + 1)}`;
};

//20210201
export const getJoinedDateAsString = (date: Date) => {
    const year = date.toLocaleDateString().split('/')[2];
    const month = date.toLocaleDateString().split('/')[0];
    const day = date.toLocaleDateString().split('/')[1];
    return `${year}${leadingZero(month)}${leadingZero(day)}`;
};

export const getCurrentTimestamp = () => new Date().getTime() / 1000;

export const getTimestamp = (date: Date) => Math.round(date.getTime() / 1000);

export const getDate = (timestamp: number) => new Date(timestamp * 1000);

const leadingZero = (val: string | number) => `0${val}`.slice(-2)

export const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0,0,0,0);
    return newDate;
};

export const getEndOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23,59,59,999);
    return newDate;
};