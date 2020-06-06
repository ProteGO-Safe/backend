import cryptoRandomString = require("crypto-random-string");

class RandomCodeGenerator {

    length: number

    constructor(length: number) {
        this.length = length;
    }

    generate(): string {
        return cryptoRandomString({length: this.length}).toUpperCase();
    }
}

export default RandomCodeGenerator;
