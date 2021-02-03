import parse = require("csv-parse/lib/sync");
import CovidStats from "../../utils/CovidStats";

class StatisticsFileParser {
    public async parse(content: string, filename: string): Promise<CovidStats> {
        const parsedContent = await parse(content, {delimiter: ','});
        const datetime = await this.resolveDatetimeFromFilename(filename);

        return new CovidStats(
            datetime,
            parseInt(parsedContent[1][3]) || null,
            parseInt(parsedContent[1][0]) || null,
            parseInt(parsedContent[1][4]) || null,
            parseInt(parsedContent[1][1]) || null,
            parseInt(parsedContent[1][5]) || null,
            parseInt(parsedContent[1][2]) || null,
            parseInt(parsedContent[1][7]) || null,
            parseInt(parsedContent[1][6]) || null,
            parseInt(parsedContent[1][9]) || null,
            parseInt(parsedContent[1][8]) || null,
            parseInt(parsedContent[1][11]) || null,
            parseInt(parsedContent[1][10]) || null,
        );
    }

    private resolveDatetimeFromFilename = (filename: string) : number => {
        const dateString = parseInt(filename.replace('covid-stats/', '')).toString().substr(0, 8);

        const year = dateString.substr(0, 4);
        const month = parseInt(dateString.substr(4, 2)) - 1;
        const day = dateString.substr(6, 2);

        return new Date(parseInt(year), month, parseInt(day)).getTime() / 1000;
    }
}

export default StatisticsFileParser;
