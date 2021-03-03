import VoivodeshipDetailsViewModel from "./VoivodeshipDetailsViewModel";

interface DetailsJsonViewModel {
    updated: number,
    voivodeships: Array<VoivodeshipDetailsViewModel>,
    lastDays: {
        cases: Array<number>,
        recovered: Array<number>,
        deaths: Array<number>,
        deathsWithComorbidities: Array<number>,
        deathsWithoutComorbidities: Array<number>,
        tests: Array<number>,
        vaccinations: Array<number>,
        vaccinationsDose1: Array<number>,
        vaccinationsDose2: Array<number>,
        undesirableReactions: Array<number>,
    }
}

export default DetailsJsonViewModel;