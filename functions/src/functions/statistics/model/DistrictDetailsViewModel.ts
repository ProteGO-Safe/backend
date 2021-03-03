interface DistrictDetailsViewModel {
    id: string,
    name: string,
    state: number | null,
    newCases: number | null,
    newDeaths: number | null,
    newRecovered: number | null,
    newDeathsWithComorbidities: number | null,
    newDeathsWithoutComorbidities: number | null,
    newTests: number | null,
    newVaccinations: number | null,
    newVaccinationsDose1: number | null,
    newVaccinationsDose2: number | null,
    totalCases: number | null,
    totalDeaths: number | null,
    totalRecovered: number | null,
    totalVaccinations: number | null,
    totalVaccinationsDose1: number | null,
    totalVaccinationsDose2: number | null,
    totalUndesirableReaction: number | null,
}

export default DistrictDetailsViewModel;