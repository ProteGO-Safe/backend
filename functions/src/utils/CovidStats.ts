class CovidStats {
    constructor(
        public updated?: number|null,
        public newCases?: number|null,
        public totalCases?: number|null,
        public newDeaths?: number|null,
        public totalDeaths?: number|null,
        public newRecovered?: number|null,
        public totalRecovered?: number|null,
        public newVaccinations?: number|null,
        public totalVaccinations?: number|null,
        public newVaccinationsDose1?: number|null,
        public totalVaccinationsDose1?: number|null,
        public newVaccinationsDose2?: number|null,
        public totalVaccinationsDose2?: number|null,
    ){}
}

export default CovidStats;
