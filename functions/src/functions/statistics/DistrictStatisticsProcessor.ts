import District from "./repository/District";
import DistrictStatistics from "./DistrictStatistics";
import {fetchIndexByTitle, parseFile} from "./StatistiscHelper";

const TITLE_EXTERNAL_ID = 'teryt';
const TITLE_DAILY_CASES = 'liczba_przypadkow';
const TITLE_DAILY_DEATHS = 'zgony';
const TITLE_DAILY_RECOVERED = 'liczba_ozdrowiencow';
const TITLE_DAILY_DEATHS_WITH_COMORBIDITIES = 'zgony_w_wyniku_covid_i_chorob_wspolistniejacych';
const TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES = 'zgony_w_wyniku_covid_bez_chorob_wspolistniejacych';
const TITLE_DAILY_TESTS = 'liczba_wykonanych_testow';
const TITLE_DAILY_VACCINATIONS = 'liczba_szczepien_dziennie';
const TITLE_DAILY_VACCINATIONS_DOSE_2 = 'dawka_2_dziennie';
const TITLE_TOTAL_VACCINATIONS = 'liczba_szczepien_ogolnie';
const TITLE_TOTAL_VACCINATIONS_DOSE_2 = 'dawka_2_ogolem';

const fetchDistrictsStatistics = async (
    districts: District[],
    rcbDistrictsFileContent: string,
    rcbDistrictVaccinationsFileContent: string
): Promise<DistrictStatistics[]> => {

    const rcbDistrictsStats = await parseFile(rcbDistrictsFileContent);
    const rcbDistrictVaccinationsStats = await parseFile(rcbDistrictVaccinationsFileContent);

    return (districts as any[]).map((district: District) => createDistrictStatistics(district, rcbDistrictsStats, rcbDistrictVaccinationsStats));
};

const createDistrictStatistics = (
    district: District,
    rcbDistrictsStats: Array<Array<string>>,
    rcbDistrictVaccinationsStats: Array<Array<string>>,
): DistrictStatistics => {

    const districtsExternalIdIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_EXTERNAL_ID);
    const districtsDailyCasesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_CASES);
    const districtsDailyDeathsIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS);
    const districtsDailyRecoveredIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_RECOVERED);
    const districtsDailyDeathsWithComorbiditiesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS_WITH_COMORBIDITIES);
    const districtsDailyDeathsWithoutComorbiditiesIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES);
    const districtsDailyTestsIndex = fetchIndexByTitle(rcbDistrictsStats[0], TITLE_DAILY_TESTS);

    const vaccinationsExternalIdIndex = fetchIndexByTitle(rcbDistrictVaccinationsStats[0], TITLE_EXTERNAL_ID);
    const vaccinationsDailyVaccinationsIndex = fetchIndexByTitle(rcbDistrictVaccinationsStats[0], TITLE_DAILY_VACCINATIONS);
    const vaccinationsDailyVaccinationsDose2Index = fetchIndexByTitle(rcbDistrictVaccinationsStats[0], TITLE_DAILY_VACCINATIONS_DOSE_2);
    const vaccinationsTotalVaccinationsIndex = fetchIndexByTitle(rcbDistrictVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS);
    const vaccinationsTotalVaccinationsDose2Index = fetchIndexByTitle(rcbDistrictVaccinationsStats[0], TITLE_TOTAL_VACCINATIONS_DOSE_2);

    const rcbDistrictsStat = rcbDistrictsStats.find(value => value[districtsExternalIdIndex] === district.externalId);
    const vaccinationsStat = rcbDistrictVaccinationsStats.find(value => value[vaccinationsExternalIdIndex] === district.externalId);

    const newVaccinations = parseInt(vaccinationsStat![vaccinationsDailyVaccinationsIndex]);
    const newVaccinationsDose2 = parseInt(vaccinationsStat![vaccinationsDailyVaccinationsDose2Index]);
    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    const totalVaccinations = parseInt(vaccinationsStat![vaccinationsTotalVaccinationsIndex]);
    const totalVaccinationsDose2 = parseInt(vaccinationsStat![vaccinationsTotalVaccinationsDose2Index]);
    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;

    return {
        districtId: district.id,
        voivodeshipId: district.voivodeshipId,
        newCases: parseInt(rcbDistrictsStat![districtsDailyCasesIndex]),
        newDeaths: parseInt(rcbDistrictsStat![districtsDailyDeathsIndex]),
        newRecovered: parseInt(rcbDistrictsStat![districtsDailyRecoveredIndex]),
        newDeathsWithComorbidities: parseInt(rcbDistrictsStat![districtsDailyDeathsWithComorbiditiesIndex]),
        newDeathsWithoutComorbidities: parseInt(rcbDistrictsStat![districtsDailyDeathsWithoutComorbiditiesIndex]),
        newTests: parseInt(rcbDistrictsStat![districtsDailyTestsIndex]),
        newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2,
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2
    }
};

export default fetchDistrictsStatistics;