import parse = require("csv-parse/lib/sync");
import {notNull} from "../../utils/AssertHelper";
import config from "../../config";

export const fetchIndexByTitle = (firstRow: Array<string>, title: string): number => {
    return firstRow.findIndex((value) => value === title)
};

export const parseFile = async (content: string, delimiter: string = ';'): Promise<Array<Array<string>>> => {
    notNull(content);
    return await parse(content, {delimiter});
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
