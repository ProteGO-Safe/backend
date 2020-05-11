class RandomCodeGenerator {

    length: number

    constructor(length: number) {
        this.length = length;
    }

    generate(): string {
        return (Math.random()).toString(36).toLocaleUpperCase().substring(2, 8);
    }
}

export default RandomCodeGenerator;