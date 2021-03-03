import DistrictStatistics from "./DistrictStatistics";
import DailyData from "./DailyData";

const fetchDailyData = (districtsStatistics: DistrictStatistics[]): DailyData => {

    return districtsStatistics.reduce((obj, item) => {
        return {
            newCases: obj.newCases + item.newCases,
            newDeaths: obj.newDeaths + item.newDeaths,
            newRecovered: obj.newRecovered + item.newRecovered,
            newDeathsWithComorbidities: obj.newDeathsWithComorbidities + item.newDeathsWithComorbidities,
            newDeathsWithoutComorbidities: obj.newDeathsWithoutComorbidities + item.newDeathsWithoutComorbidities,
            newTests: obj.newTests + item.newTests,
            newVaccinations: obj.newVaccinations + item.newVaccinations,
            newVaccinationsDose1: obj.newVaccinationsDose1 + item.newVaccinationsDose1,
            newVaccinationsDose2: obj.newVaccinationsDose2 + item.newVaccinationsDose2
        }
    }, {
        newCases: 0,
        newDeaths: 0,
        newRecovered: 0,
        newDeathsWithComorbidities: 0,
        newDeathsWithoutComorbidities: 0,
        newTests: 0,
        newVaccinations: 0,
        newVaccinationsDose1: 0,
        newVaccinationsDose2: 0
    });
};

export default fetchDailyData;
