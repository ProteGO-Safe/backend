export const timestampToFormattedDayMonth = (timestampInSeconds: number | null | undefined) => {
    const date = new Date();

    if (!!timestampInSeconds && isNumeric(timestampInSeconds)) {
        date.setTime(Number(timestampInSeconds) * 1000);
    }

    return `${leadingZero(date.getUTCDate())}.${leadingZero(date.getUTCMonth() + 1)}`;
}

const leadingZero = (val: string | number) => `0${val}`.slice(-2)

const isNumeric = (val: any) => !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
