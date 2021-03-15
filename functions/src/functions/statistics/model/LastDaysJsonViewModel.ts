interface LastDaysJsonViewModel {
    cases: (number|null)[],
    recovered: (number|null)[],
    deaths: (number|null)[],
    deathsWithComorbidities: (number|null)[],
    deathsWithoutComorbidities: (number|null)[],
    tests: (number|null)[],
    vaccinations: (number|null)[],
    vaccinationsDose1: (number|null)[],
    vaccinationsDose2: (number|null)[],
}

export default LastDaysJsonViewModel;