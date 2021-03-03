interface DistrictStatistics {
    districtId: string,
    voivodeshipId: string,
    newCases: number,
    newDeaths: number,
    newRecovered: number,
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
    newVaccinations: number,
    newVaccinationsDose1: number,
    newVaccinationsDose2: number,
    totalVaccinations: number,
    totalVaccinationsDose1: number,
    totalVaccinationsDose2: number,
}

export default DistrictStatistics;
