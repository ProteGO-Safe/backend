import District from "./repository/District";
import DistrictStatistics from "./DistrictStatistics";
import File from "./File"

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

const fetchDistrictsStatistics = (
    districts: District[],
    rcbDistrictsFile: File,
    rcbDistrictVaccinationsFile: File
): DistrictStatistics[] => {

    return (districts as any[]).map((district: District) => createDistrictStatistics(district, rcbDistrictsFile, rcbDistrictVaccinationsFile));
};

const createDistrictStatistics = (
    district: District,
    rcbDistrictsFile: File,
    rcbDistrictVaccinationsFile: File,
): DistrictStatistics => {

    const distinctExternalId = district.externalId;

    const newVaccinations = rcbDistrictVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_VACCINATIONS);
    const newVaccinationsDose2 = rcbDistrictVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_VACCINATIONS_DOSE_2);

    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    const totalVaccinations = rcbDistrictVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_TOTAL_VACCINATIONS);
    const totalVaccinationsDose2 = rcbDistrictVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_TOTAL_VACCINATIONS_DOSE_2);

    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;

    return {
        districtId: district.id,
        voivodeshipId: district.voivodeshipId,
        newCases: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_CASES),
        newDeaths: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_DEATHS),
        newRecovered: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_RECOVERED),
        newDeathsWithComorbidities: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_DEATHS_WITH_COMORBIDITIES),
        newDeathsWithoutComorbidities: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES),
        newTests: rcbDistrictsFile.getValueById(TITLE_EXTERNAL_ID, distinctExternalId, TITLE_DAILY_TESTS),
        newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2,
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2
    }
};

export default fetchDistrictsStatistics;