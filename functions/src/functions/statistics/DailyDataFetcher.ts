import DailyData from "./DailyData";
import File from "./File"

const TITLE_WHOLE_COUNTRY = 'Cały kraj';
const TITLE_DAILY_CASES = 'liczba_przypadkow';
const TITLE_DAILY_DEATHS = 'zgony';
const TITLE_DAILY_RECOVERED = 'liczba_ozdrowiencow';
const TITLE_DAILY_DEATHS_WITH_COMORBIDITIES = 'zgony_w_wyniku_covid_i_chorob_wspolistniejacych';
const TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES = 'zgony_w_wyniku_covid_bez_chorob_wspolistniejacych';
const TITLE_DAILY_TESTS = 'liczba_wykonanych_testow';
const TITLE_DAILY_VACCINATIONS = 'liczba_szczepien_dziennie';
const TITLE_DAILY_VACCINATIONS_DOSE_2 = 'dawka_2_dziennie';

const fetchDailyData = (
    rcbDistrictsFile: File,
    rcbGlobalVaccinationsFile: File): DailyData => {

    const newVaccinations = rcbGlobalVaccinationsFile.getFirstRowValue(TITLE_DAILY_VACCINATIONS);
    const newVaccinationsDose2 = rcbGlobalVaccinationsFile.getFirstRowValue(TITLE_DAILY_VACCINATIONS_DOSE_2);
    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    return {
        newCases: rcbDistrictsFile.getValue(TITLE_DAILY_CASES, TITLE_WHOLE_COUNTRY),
        newDeaths: rcbDistrictsFile.getValue(TITLE_DAILY_DEATHS, TITLE_WHOLE_COUNTRY),
        newRecovered: rcbDistrictsFile.getValue(TITLE_DAILY_RECOVERED, TITLE_WHOLE_COUNTRY),
        newDeathsWithComorbidities: rcbDistrictsFile.getValue(TITLE_DAILY_DEATHS_WITH_COMORBIDITIES, TITLE_WHOLE_COUNTRY),
        newDeathsWithoutComorbidities: rcbDistrictsFile.getValue(TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES, TITLE_WHOLE_COUNTRY),
        newTests: rcbDistrictsFile.getValue(TITLE_DAILY_TESTS, TITLE_WHOLE_COUNTRY),
        newVaccinations: newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2
    }
};

export default fetchDailyData;
