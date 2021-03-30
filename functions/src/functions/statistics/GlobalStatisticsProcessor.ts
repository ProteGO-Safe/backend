import {fetchIndexByTitle, parseFile} from "./StatistiscHelper";
import GlobalStatistics from "./GlobalStatistics";

const TITLE_TOTAL_CASES = 'sumaryczna_ilosc_zakazen_od_poczatku_pandemii';
const TITLE_TOTAL_DEATHS = 'sumaryczna_ilosc_przypadkow_smiertelnych';
const TITLE_TOTAL_RECOVERED = 'sumaryczna_liczba_ozdrowiencow';
const TITLE_TOTAL_VACCINATIONS = 'liczba_szczepien_ogolem';
const TITLE_TOTAL_VACCINATIONS_DOSE_2 = 'dawka_2_ogolem';
const TITLE_TOTAL_UNDESIRABLE_REACTION = 'odczyny_niepozadane';

const fetchGlobalStatistics = async (
    rcbGlobalFileContent: string,
    rcbGlobalVaccinationsFileContent: string,
    rcbGlobalVaccinationsOtherFileContent: string
): Promise<GlobalStatistics> => {

    const rcbGlobalStats = await parseFile(rcbGlobalFileContent);
    const rcbGlobalVaccinationsStats = await parseFile(rcbGlobalVaccinationsFileContent);
    const rcbGlobalVaccinationsOtherStats = await parseFile(rcbGlobalVaccinationsOtherFileContent);

    return createGlobalStatistics(rcbGlobalStats, rcbGlobalVaccinationsStats, rcbGlobalVaccinationsOtherStats);
};

const createGlobalStatistics = (
    rcbGlobalStats: Array<Array<string>>,
    rcbGlobalVaccinationsStats: Array<Array<string>>,
    rcbGlobalVaccinationsOtherStats: Array<Array<string>>,
): GlobalStatistics => {

    if(rcbGlobalStats.length !== 2) {
        throw new Error('illegal rcbGlobalStats content');
    }

    const totalCasesIndex = fetchIndexByTitle(rcbGlobalStats[0], TITLE_TOTAL_CASES);
    const totalDeathsIndex = fetchIndexByTitle(rcbGlobalStats[0], TITLE_TOTAL_DEATHS);
    const totalRecoveredIndex = fetchIndexByTitle(rcbGlobalStats[0], TITLE_TOTAL_RECOVERED);
    const totalVaccinationsIndex = fetchIndexByTitle(rcbGlobalVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS);
    const totalVaccinationsDose2Index = fetchIndexByTitle(rcbGlobalVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS_DOSE_2);
    const totalUndesirableReactionIndex = fetchIndexByTitle(rcbGlobalVaccinationsOtherStats[0], TITLE_TOTAL_UNDESIRABLE_REACTION);


    const totalCases = parseInt(rcbGlobalStats[1][totalCasesIndex]);
    const totalDeaths = parseInt(rcbGlobalStats[1][totalDeathsIndex]);
    const totalRecovered = parseInt(rcbGlobalStats[1][totalRecoveredIndex]);
    const totalVaccinations = parseInt(rcbGlobalVaccinationsStats[1][totalVaccinationsIndex]);
    const totalVaccinationsDose2 = parseInt(rcbGlobalVaccinationsStats[1][totalVaccinationsDose2Index]);
    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;
    const totalUndesirableReaction = parseInt(rcbGlobalVaccinationsOtherStats[1][totalUndesirableReactionIndex]);

    return {
        totalCases,
        totalDeaths,
        totalRecovered,
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2,
        totalUndesirableReaction
    }
};


export default fetchGlobalStatistics;