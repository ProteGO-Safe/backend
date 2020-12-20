import parse = require("csv-parse/lib/sync");
import CovidStats from "../../utils/CovidStats";

class StatisticsFileParser {
    public async parse(content: string): Promise<CovidStats> {
        const parsedContent = await parse(content, {delimiter: ','});

        return new CovidStats(
            null,
            parseInt(parsedContent[1][3]) || null,
            parseInt(parsedContent[1][0]) || null,
            parseInt(parsedContent[1][4]) || null,
            parseInt(parsedContent[1][1]) || null,
            parseInt(parsedContent[1][5]) || null,
            parseInt(parsedContent[1][2]) || null,
        );
    }
}

export default StatisticsFileParser;
