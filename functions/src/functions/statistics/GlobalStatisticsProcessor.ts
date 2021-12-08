import GlobalStatistics from "./GlobalStatistics";
import File from "./File"

const TITLE_TOTAL_CASES = 'sumaryczna_ilosc_zakazen_od_poczatku_pandemii';
const TITLE_TOTAL_DEATHS = 'sumaryczna_ilosc_przypadkow_smiertelnych';
const TITLE_TOTAL_RECOVERED = 'sumaryczna_liczba_ozdrowiencow';
const TITLE_TOTAL_VACCINATIONS = 'liczba_szczepien_ogolem';
const TITLE_TOTAL_VACCINATIONS_DOSE_2 = 'dawka_2_ogolem';
const TITLE_TOTAL_UNDESIRABLE_REACTION = 'odczyny_niepozadane';

const fetchGlobalStatistics = (
    rcbGlobalFile: File,
    rcbGlobalVaccinationsFile: File,
    rcbGlobalVaccinationsOtherFile: File
): GlobalStatistics => {

    const totalVaccinations = rcbGlobalVaccinationsFile.getFirstRowValue(TITLE_TOTAL_VACCINATIONS);
    const totalVaccinationsDose2 = rcbGlobalVaccinationsFile.getFirstRowValue(TITLE_TOTAL_VACCINATIONS_DOSE_2);
    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;

    return {
        totalCases: rcbGlobalFile.getFirstRowValue(TITLE_TOTAL_CASES),
        totalDeaths: rcbGlobalFile.getFirstRowValue(TITLE_TOTAL_DEATHS),
        totalRecovered: rcbGlobalFile.getFirstRowValue(TITLE_TOTAL_RECOVERED),
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2,
        totalUndesirableReaction: rcbGlobalVaccinationsOtherFile.getFirstRowValue(TITLE_TOTAL_UNDESIRABLE_REACTION)
    }
};

export default fetchGlobalStatistics;