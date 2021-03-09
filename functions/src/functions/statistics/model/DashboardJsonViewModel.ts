interface DashboardJsonViewModel {
    updated: number,
    newCases: number,
    newDeaths: number,
    newRecovered: number,
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
    newVaccinations: number,
    newVaccinationsDose1: number,
    newVaccinationsDose2: number,
    totalCases: number,
    totalDeaths: number,
    totalRecovered: number,
    totalVaccinations: number,
    totalVaccinationsDose1: number,
    totalVaccinationsDose2: number,
    totalUndesirableReaction: number
}

export default DashboardJsonViewModel;