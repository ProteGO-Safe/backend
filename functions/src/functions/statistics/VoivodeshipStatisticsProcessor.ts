import {fetchIndexByTitle, parseFile} from "./StatistiscHelper";
import Voivodeship from "./repository/Voivodeship";
import VoivodeshipStatistics from "./VoivodeshipStatistics";

const TITLE_EXTERNAL_ID = 'teryt';
const TITLE_DAILY_CASES = 'liczba_przypadkow';
const TITLE_DAILY_DEATHS = 'zgony';
const TITLE_DAILY_RECOVERED = 'liczba_ozdrowiencow';
const TITLE_DAILY_DEATHS_WITH_COMORBIDITIES = 'zgony_w_wyniku_covid_i_chorob_wspolistniejacych';
const TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES = 'zgony_w_wyniku_covid_bez_chorob_wspolistniejacych';
const TITLE_DAILY_TESTS = 'liczba_wykonanych_testow';
const TITLE_DAILY_VACCINATIONS = 'liczba_szczepien_dziennie';
const TITLE_DAILY_VACCINATIONS_DOSE_2 = 'dawka_2_dziennie';
const TITLE_TOTAL_VACCINATIONS = 'liczba_szczepien_ogolem';
const TITLE_TOTAL_VACCINATIONS_DOSE_2 = 'dawka_2_ogolem';

const fetchVoivodeshipsStatistics = async (
    voivodeships: Voivodeship[],
    rcbVoivodeshipsFileContent: string,
    rcbVoivodeshipVaccinationsFileContent: string,
): Promise<VoivodeshipStatistics[]> => {

    const rcbVoivodeshipsStats = await parseFile(rcbVoivodeshipsFileContent);
    const rcbVoivodeshipsVaccinationsStats = await parseFile(rcbVoivodeshipVaccinationsFileContent);

    return (voivodeships as any[]).map((voivodeship: Voivodeship) => createVoivodeshipStatistics(voivodeship, rcbVoivodeshipsStats, rcbVoivodeshipsVaccinationsStats));
};

const createVoivodeshipStatistics = (
    voivodeship: Voivodeship,
    rcbVoivodeshipsStats: Array<Array<string>>,
    rcbVoivodeshipsVaccinationsStats: Array<Array<string>>,
): VoivodeshipStatistics => {

    const voivodeshipsExternalIdIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_EXTERNAL_ID);
    const voivodeshipsDailyCasesIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_CASES);
    const voivodeshipsDailyDeathsIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_DEATHS);
    const voivodeshipsDailyRecoveredIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_RECOVERED);
    const voivodeshipsDailyDeathsWithComorbiditiesIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_DEATHS_WITH_COMORBIDITIES);
    const voivodeshipsDailyDeathsWithoutComorbiditiesIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES);
    const voivodeshipsDailyTestsIndex = fetchIndexByTitle(rcbVoivodeshipsStats[0], TITLE_DAILY_TESTS);

    const vaccinationsExternalIdIndex = fetchIndexByTitle(rcbVoivodeshipsVaccinationsStats[0], TITLE_EXTERNAL_ID);
    const vaccinationsDailyVaccinationsIndex = fetchIndexByTitle(rcbVoivodeshipsVaccinationsStats[0], TITLE_DAILY_VACCINATIONS);
    const vaccinationsDailyVaccinationsDose2Index = fetchIndexByTitle(rcbVoivodeshipsVaccinationsStats[0], TITLE_DAILY_VACCINATIONS_DOSE_2);
    const vaccinationsTotalVaccinationsIndex = fetchIndexByTitle(rcbVoivodeshipsVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS);
    const vaccinationsTotalVaccinationsDose2Index = fetchIndexByTitle(rcbVoivodeshipsVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS_DOSE_2);

    const rcbVoivodeshipStat = rcbVoivodeshipsStats.find(value => value[voivodeshipsExternalIdIndex] === voivodeship.externalId);
    const vaccinationsStat = rcbVoivodeshipsVaccinationsStats.find(value => value[vaccinationsExternalIdIndex] === voivodeship.externalId);

    const newVaccinations = parseInt(vaccinationsStat![vaccinationsDailyVaccinationsIndex]);
    const newVaccinationsDose2 = parseInt(vaccinationsStat![vaccinationsDailyVaccinationsDose2Index]);
    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    const totalVaccinations = parseInt(vaccinationsStat![vaccinationsTotalVaccinationsIndex]);
    const totalVaccinationsDose2 = parseInt(vaccinationsStat![vaccinationsTotalVaccinationsDose2Index]);
    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;

    return {
        voivodeshipId: voivodeship.id,
        newCases: parseInt(rcbVoivodeshipStat![voivodeshipsDailyCasesIndex]),
        newDeaths: parseInt(rcbVoivodeshipStat![voivodeshipsDailyDeathsIndex]),
        newRecovered: parseInt(rcbVoivodeshipStat![voivodeshipsDailyRecoveredIndex]),
        newDeathsWithComorbidities: parseInt(rcbVoivodeshipStat![voivodeshipsDailyDeathsWithComorbiditiesIndex]),
        newDeathsWithoutComorbidities: parseInt(rcbVoivodeshipStat![voivodeshipsDailyDeathsWithoutComorbiditiesIndex]),
        newTests: parseInt(rcbVoivodeshipStat![voivodeshipsDailyTestsIndex]),
        newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2,
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2
    }
};

export default fetchVoivodeshipsStatistics;