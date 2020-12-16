import CovidStats from "../../utils/CovidStats";
import {error} from "firebase-functions/lib/logger";
import StatisticsFileReader from "./StatisticsFileReader";
import parse = require("csv-parse/lib/sync");

class StatisticsReader {
    constructor(private readonly statisticsFileReader: StatisticsFileReader) {
    }

    async getLastStatistics(): Promise<CovidStats> {
        const
            newCasesFile = await this.statisticsFileReader.readLastNewCasesFile(),
            totalCasesFile = await this.statisticsFileReader.readLastTotalCasesFile();

        console.log(newCasesFile);
        if (!newCasesFile || !totalCasesFile || newCasesFile.date.getTime() !== totalCasesFile.date.getTime()) {
            error(`Cannot read statistics files from the server`, newCasesFile, totalCasesFile)
            return new CovidStats();
        }

        const
            newCases = await parse(newCasesFile.content, {delimiter: ';'}),
            totalCases = await parse(totalCasesFile.content, {delimiter: ';'});

        return new CovidStats(
            newCasesFile.date.getTime() / 1000,
            parseInt(newCases[1][1]) || null,
            parseInt(totalCases[1][0]) || null,
            parseInt(newCases[1][4]) || null,
            parseInt(totalCases[1][1]) || null,
            null,
            null,
        );
    }
}

export default StatisticsReader;
