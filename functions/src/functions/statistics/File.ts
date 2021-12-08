import {fetchIndexByTitle, parseFile, parseNumber} from "./StatistiscHelper";

class File {

    name: string;
    parsedContent: string[][];

    constructor(name: string, content: string) {
        this.name = name;
        this.parsedContent = parseFile(content);
    }

    getValue(columnHeader: string, rowHeader: string) {
        // tslint:disable-next-line:no-shadowed-variable
        const index = this.parsedContent[0].findIndex((value) => value.includes(columnHeader));

        const row = this.parsedContent.find(array => array[0] === rowHeader);

        const value = row![index];

        return parseNumber(value, this.name, columnHeader);
    }

    getFirstRowValue(fieldHeader: string) {

        if(this.parsedContent.length !== 2) {
            throw new Error('illegal rcbGlobalStats content');
        }

        // tslint:disable-next-line:no-shadowed-variable
        const index = this.parsedContent[0].findIndex((value) => value.includes(fieldHeader));

        const value = this.parsedContent[1][index];

        return parseNumber(value, this.name, fieldHeader);
    }

    getValueById(fieldHeaderId: string, externalId: string, fieldHeader: string) {
        const idIndex = fetchIndexByTitle(this.parsedContent[0], fieldHeaderId);

        // tslint:disable-next-line:no-shadowed-variable
        const row = this.parsedContent.find(value => value[idIndex] === externalId);
        // tslint:disable-next-line:no-shadowed-variable
        const index = this.parsedContent[0].findIndex((value) => value.includes(fieldHeader));

        const value = row![index];

        return parseNumber(value, this.name, fieldHeader);
    }

    listIdAndValue(fieldHeaderId: string, fieldHeaderValue: string, convertToObject: any) {
        const externalIdIndex = fetchIndexByTitle(this.parsedContent[0], fieldHeaderId);
        const valueIndex = fetchIndexByTitle(this.parsedContent[0], fieldHeaderValue);
        return this.parsedContent
            .filter((value, index) => index !== 0)
            .map(row => {
                const externalId = row[externalIdIndex];
                const value = row[valueIndex];
                return convertToObject(externalId, parseNumber(value, this.name, fieldHeaderValue));
            });
    }
}

export default File;