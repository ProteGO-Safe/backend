export const dummyVoivodeshipsStates = [
    {
        id: 1,
        name: "n1",
        districts: [
            {
                id: 2,
                name: "n1",
                state: 1
            },
            {
                id: 3,
                name: "n2",
                state: 2
            }]
    },
    {
        id: 2,
        name: "n2",
        districts: [
            {
                id: 4,
                name: "n3",
                state: 3
            }
        ]
    }];

export const dummyCovidStats = {
    updated: 111,
    newCases: 111,
    totalCases: 111,
    newDeaths: 111,
    totalDeaths: 111,
    newRecovered: 111,
    totalRecovered: 111,
    newVaccinations: 111,
    totalVaccinations: 111,
    newVaccinationsDose1: 111,
    totalVaccinationsDose1: 111,
    newVaccinationsDose2: 111,
    totalVaccinationsDose2: 111
};

export const dummyCovidInfo = {
    updated: 111,
    voivodeshipsUpdated: 111,
    covidStats: dummyCovidStats,
    voivodeships: dummyVoivodeshipsStates
};

export const dummyDashboard = {
    updated: 111,
    newCases: 111,
    newDeaths: 111,
    newRecovered: 111,
    newDeathsWithComorbidities: 111,
    newDeathsWithoutComorbidities: 111,
    newTests: 111,
    newVaccinations: 111,
    newVaccinationsDose1: 111,
    newVaccinationsDose2: 111,
    newUndesirableReaction: 111,
    totalCases: 111,
    totalDeaths: 111,
    totalRecovered: 111,
    totalVaccinations: 111,
    totalVaccinationsDose1: 111,
    totalVaccinationsDose2: 111,
    totalUndesirableReaction: 111
};

export const dummyVoivodeships = [
    {
        id: "idv1",
        name: "n1",
        districts: [
            {
                id: "idd1",
                name: "n1",
                state: 1,
                newCases: null,
                newDeaths: null,
                newRecovered: null,
                newDeathsWithComorbidities: null,
                newDeathsWithoutComorbidities: null,
                newTests: null,
                newVaccinations: null,
                newVaccinationsDose1: null,
                newVaccinationsDose2: null,
                totalCases: null,
                totalDeaths: null,
                totalRecovered: null,
                totalVaccinations: null,
                totalVaccinationsDose1: null,
                totalVaccinationsDose2: null,
                totalUndesirableReaction: null,
            },
            {
                id: "idd2",
                name: "n2",
                state: 2,
                newCases: null,
                newDeaths: null,
                newRecovered: null,
                newDeathsWithComorbidities: null,
                newDeathsWithoutComorbidities: null,
                newTests: null,
                newVaccinations: null,
                newVaccinationsDose1: null,
                newVaccinationsDose2: null,
                totalCases: null,
                totalDeaths: null,
                totalRecovered: null,
                totalVaccinations: null,
                totalVaccinationsDose1: null,
                totalVaccinationsDose2: null,
                totalUndesirableReaction: null,
            }]
    },
    {
        id: "idv2",
        name: "n2",
        districts: [
            {
                id: "idd3",
                name: "n3",
                state: 3,
                newCases: null,
                newDeaths: null,
                newRecovered: null,
                newDeathsWithComorbidities: null,
                newDeathsWithoutComorbidities: null,
                newTests: null,
                newVaccinations: null,
                newVaccinationsDose1: null,
                newVaccinationsDose2: null,
                totalCases: null,
                totalDeaths: null,
                totalRecovered: null,
                totalVaccinations: null,
                totalVaccinationsDose1: null,
                totalVaccinationsDose2: null,
                totalUndesirableReaction: null,
            }
        ]
    }];

export const dummyLastDays = {
    cases: [],
    recovered: [],
    deaths: [],
    deathsWithComorbidities: [],
    deathsWithoutComorbidities: [],
    tests: [],
    vaccinations: [],
    vaccinationsDose1: [],
    vaccinationsDose2: [],
    undesirableReactions: [],
}

export const dummyDetails = {
    updated: 111,
    lastDays: dummyLastDays,
    voivodeships: dummyVoivodeships
};

export const dummyDistricts = {
    updated: 111,
    voivodeships: dummyVoivodeshipsStates
};

export const dummyDailyData = {
    newCases: 111,
    newDeaths: 111,
    newRecovered: 111,
    newDeathsWithComorbidities: 111,
    newDeathsWithoutComorbidities: 111,
    newTests: 111,
    newVaccinations: 111,
    newVaccinationsDose1: 111,
    newVaccinationsDose2: 111
};

export const dummyStatistic = {
    id: "111",
    date: new Date(),
    covidInfo: dummyCovidInfo,
    dashboard: dummyDashboard,
    details: dummyDetails,
    districts: dummyDistricts,
    dailyData: dummyDailyData,
    published: false
};