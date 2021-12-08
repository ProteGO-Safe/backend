import parse = require("csv-parse/lib/sync");
import {notNull} from "../../utils/AssertHelper";
import config from "../../config";
import NumberFormatError from "./errors/NumberFormatError";

export const fetchIndexByTitle = (firstRow: Array<string>, title: string): number => {
    return firstRow.findIndex((value) => value.includes(title))
};

export const parseFile = (content: string, delimiter: string = ';'): Array<Array<string>> => {
    notNull(content);
    return parse(content, {delimiter});
};

export const getMinimumTimeToExecute = (): Date => {
    const minimumTimeToExecute = new Date();
    minimumTimeToExecute.setHours(
        parseInt(config.statistics.publishTime.split(':')[0]),
        parseInt(config.statistics.publishTime.split(':')[1]),
        0,
        0);
    return minimumTimeToExecute;
};

export const parseNumber = (value: string, fileName: string, fieldName: string): number => {

    const int = parseInt(value);

    if (Number.isInteger(int)) {
        return int;
    }

    throw new NumberFormatError("invalid number: " + value + " in the field: " + fieldName + " in the file name: " + fileName);
};
