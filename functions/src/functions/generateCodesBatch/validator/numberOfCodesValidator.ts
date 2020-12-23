const isValidNumberOfCodes = (numberOfCodes: number): boolean => {
    return Number.isInteger(numberOfCodes) && numberOfCodes > 0 && numberOfCodes <= 1000;
}

export default isValidNumberOfCodes;