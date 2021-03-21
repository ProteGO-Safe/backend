import DailyData from "./DailyData";
import {fetchIndexByTitle, parseFile} from "./StatistiscHelper";

const TITLE_WHOLE_COUNTRY = 'Cały kraj';
const TITLE_DAILY_CASES = 'liczba_przypadkow';
const TITLE_DAILY_DEATHS = 'zgony';
const TITLE_DAILY_RECOVERED = 'liczba_ozdrowiencow';
const TITLE_DAILY_DEATHS_WITH_COMORBIDITIES = 'zgony_w_wyniku_covid_i_chorob_wspolistniejacych';
const TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES = 'zgony_w_wyniku_covid_bez_chorob_wspolistniejacych';
const TITLE_DAILY_TESTS = 'liczba_wykonanych_testow';
const TITLE_DAILY_VACCINATIONS = 'liczba_szczepien_dziennie';
const TITLE_DAILY_VACCINATIONS_DOSE_2 = 'dawka_2_dziennie';

const fetchDailyData = async (
    rcbDistrictsFileContent: string,
    rcbGlobalVaccinationsFileContent: string): Promise<DailyData> => {

    const rcbDistrictsStats = await parseFile(rcbDistrictsFileContent);
    const rcbGlobalVaccinationsStats = await parseFile(rcbGlobalVaccinationsFileContent);

    const wholeCountryData = rcbDistrictsStats.find(array => array[0] === TITLE_WHOLE_COUNTRY);

    const dailyCasesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_CASES);
    const dailyDeathsIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS);
    const dailyRecoveredIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_RECOVERED);
    const dailyDeathsWithComorbiditiesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS_WITH_COMORBIDITIES);
    const dailyDeathsWithoutComorbiditiesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES);
    const dailyTestsIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_TESTS);
    const dailyVaccinationsIndex = fetchIndexByTitle(rcbGlobalVaccinationsStats[0], TITLE_DAILY_VACCINATIONS);
    const dailyVaccinationsDose2Index = fetchIndexByTitle(rcbGlobalVaccinationsStats[0], TITLE_DAILY_VACCINATIONS_DOSE_2);

    const newCases = parseInt(wholeCountryData![dailyCasesIndex]);
    const newDeaths = parseInt(wholeCountryData![dailyDeathsIndex]);
    const newRecovered = parseInt(wholeCountryData![dailyRecoveredIndex]);
    const newDeathsWithComorbidities = parseInt(wholeCountryData![dailyDeathsWithComorbiditiesIndex]);
    const newDeathsWithoutComorbidities = parseInt(wholeCountryData![dailyDeathsWithoutComorbiditiesIndex]);
    const newTests = parseInt(wholeCountryData![dailyTestsIndex]);
    const newVaccinations = parseInt(rcbGlobalVaccinationsStats[1][dailyVaccinationsIndex]);
    const newVaccinationsDose2 = parseInt(rcbGlobalVaccinationsStats[1][dailyVaccinationsDose2Index]);
    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    return {
        newCases,
        newDeaths,
        newRecovered,
        newDeathsWithComorbidities,
        newDeathsWithoutComorbidities,
        newTests,
        newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2
    }


};

export default fetchDailyData;
