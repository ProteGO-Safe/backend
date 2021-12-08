import Voivodeship from "./repository/Voivodeship";
import VoivodeshipStatistics from "./VoivodeshipStatistics";
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

const fetchVoivodeshipsStatistics = (
    voivodeships: Voivodeship[],
    rcbVoivodeshipsFile: File,
    rcbVoivodeshipVaccinationsFile: File,
): VoivodeshipStatistics[] => {

    return (voivodeships as any[]).map((voivodeship: Voivodeship) => createVoivodeshipStatistics(voivodeship, rcbVoivodeshipsFile, rcbVoivodeshipVaccinationsFile));
};

const createVoivodeshipStatistics = (
    voivodeship: Voivodeship,
    rcbVoivodeshipsFile: File,
    rcbVoivodeshipVaccinationsFile: File,
): VoivodeshipStatistics => {

    const voivodeshipExternalId = voivodeship.externalId;

    const newVaccinations = rcbVoivodeshipVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_VACCINATIONS);
    const newVaccinationsDose2 = rcbVoivodeshipVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_VACCINATIONS_DOSE_2);
    const newVaccinationsDose1 = newVaccinations - newVaccinationsDose2;

    const totalVaccinations = rcbVoivodeshipVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_TOTAL_VACCINATIONS);
    const totalVaccinationsDose2 = rcbVoivodeshipVaccinationsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_TOTAL_VACCINATIONS_DOSE_2);
    const totalVaccinationsDose1 = totalVaccinations - totalVaccinationsDose2;

    return {
        voivodeshipId: voivodeship.id,
        newCases: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_CASES),
        newDeaths: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_DEATHS),
        newRecovered: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_RECOVERED),
        newDeathsWithComorbidities: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_DEATHS_WITH_COMORBIDITIES),
        newDeathsWithoutComorbidities: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_DEATHS_WITHOUT_COMORBIDITIES),
        newTests: rcbVoivodeshipsFile.getValueById(TITLE_EXTERNAL_ID, voivodeshipExternalId, TITLE_DAILY_TESTS),
        newVaccinations,
        newVaccinationsDose1,
        newVaccinationsDose2,
        totalVaccinations,
        totalVaccinationsDose1,
        totalVaccinationsDose2
    }
};

export default fetchVoivodeshipsStatistics;