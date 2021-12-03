class NumberFormatError extends Error {
    constructor(m: string) {
        super(m);

        Object.setPrototypeOf(this, NumberFormatError.prototype);
    }
}

export default NumberFormatError