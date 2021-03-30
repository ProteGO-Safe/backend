import {parseFile} from "./StatistiscHelper";
import LastDaysJsonViewModel from "./model/LastDaysJsonViewModel";
import config from "../../config";

const TITLE_CASES = 'cases';
const TITLE_RECOVERED = 'recovered';
const TITLE_DEATHS = 'deaths';
const TITLE_DEATHS_WITH_COMORBIDITIES = 'deathsWithComorbidities';
const TITLE_DEATHS_WITHOUT_COMORBIDITIES = 'deathsWithoutComorbidities';
const TITLE_TESTS = 'tests';
const TITLE_VACCINATIONS = 'vaccinations';
const TITLE_VACCINATIONS_DOSE_1 = 'vaccinationsDose1';
const TITLE_VACCINATIONS_DOSE_2 = 'vaccinationsDose2';
const TITLE_UNDESIRABLE_REACTIONS = 'undesirableReactions';

const fetchArrayByProperty = (arrays: Array<Array<string>>, field: string): Array<number> => {
    const array = arrays.find(value => value[0] === field)!;
    return [...array.slice(1)].map(value => parseInt(value)).slice(0-config.statistics.lastDaysDetails)
};

const fetchLastDaysData = async (fileContent: string): Promise<LastDaysJsonViewModel> => {

    const lastDaysArray = await parseFile(fileContent);

    return {
        cases: fetchArrayByProperty(lastDaysArray, TITLE_CASES),
        recovered: fetchArrayByProperty(lastDaysArray, TITLE_RECOVERED),
        deaths: fetchArrayByProperty(lastDaysArray, TITLE_DEATHS),
        deathsWithComorbidities: fetchArrayByProperty(lastDaysArray, TITLE_DEATHS_WITH_COMORBIDITIES),
        deathsWithoutComorbidities: fetchArrayByProperty(lastDaysArray, TITLE_DEATHS_WITHOUT_COMORBIDITIES),
        tests: fetchArrayByProperty(lastDaysArray, TITLE_TESTS),
        vaccinations: fetchArrayByProperty(lastDaysArray, TITLE_VACCINATIONS),
        vaccinationsDose1: fetchArrayByProperty(lastDaysArray, TITLE_VACCINATIONS_DOSE_1),
        vaccinationsDose2: fetchArrayByProperty(lastDaysArray, TITLE_VACCINATIONS_DOSE_2),
        undesirableReactions: fetchArrayByProperty(lastDaysArray, TITLE_UNDESIRABLE_REACTIONS),
    }
};


export default fetchLastDaysData;
