interface DailyData {
    newCases: number,
    newDeaths: number,
    newRecovered: number,
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
    newVaccinations: number,
    newVaccinationsDose1: number,
    newVaccinationsDose2: number
}

export default DailyData;