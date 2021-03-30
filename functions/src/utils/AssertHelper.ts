export const notNull = (value: any) => {
    if (!value) {
        throw new Error(`${value} can not be null`);
    }
};