import cryptoRandomString = require("crypto-random-string");

class RandomCodeGenerator {
    length: number

    constructor(length: number) {
        this.length = length;
    }

    generate(): string {
        let pin;

        do {
            pin = cryptoRandomString({
                length: this.length,
                characters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            });
        } while (!RandomCodeGenerator.isAlphaNumeric(pin))

        return pin;
    }

    private static isAlphaNumeric(code: string): boolean {
        let i, charCode, isAlpha = false, isNumeric = false;

        for (i = 0; i < code.length; i++) {
            charCode = code.charCodeAt(i);

            switch (true){
                case charCode > 47 && charCode < 58:
                    isNumeric = true;
                    break;
                case (charCode > 64 && charCode < 91):
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
