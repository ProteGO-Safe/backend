class CovidStats {
    constructor(
        public updated?: number|null,
        public newCases?: number|null,
        public totalCases?: number|null,
        public newDeaths?: number|null,
        public totalDeaths?: number|null,
        public newRecovered?: number|null,
        public totalRecovered?: number|null,
    ){}
}

export default CovidStats;
