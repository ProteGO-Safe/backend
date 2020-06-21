import cryptoRandomString = require("crypto-random-string");

class RandomCodeGenerator {

    length: number

    constructor(length: number) {
        this.length = length;
    }

    generate(): string {
        let pin;

        do {
            pin = cryptoRandomString({length: this.length}).toUpperCase();
        } while (!RandomCodeGenerator.isAlphaNumeric(pin))

        return pin;
    }

    private static isAlphaNumeric(code: string): boolean {
        let i, charCode, isAlpha = false, isNumeric = false;

        for (i = 0, code.length; i < code.length; i++) {
            charCode = code.charCodeAt(i);

            switch (true){
                case code > 47 && code < 58:
                    isNumeric = true;
                    break;
                case (code > 64 && code < 91):
                    isAlpha = true;
                    break;
                default:
                    return false;
            }
        }

        return isAlpha && isNumeric;
    }
}

export default RandomCodeGenerator;
