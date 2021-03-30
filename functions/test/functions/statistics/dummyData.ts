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
    updated: 1111,
    newCases: 1112,
    newDeaths: 1113,
    newRecovered: 1114,
    newDeathsWithComorbidities: 1115,
    newDeathsWithoutComorbidities: 1116,
    newTests: 1117,
    newVaccinations: 1118,
    newVaccinationsDose1: 1119,
    newVaccinationsDose2: 11110,
    totalCases: 11111,
    totalDeaths: 11112,
    totalRecovered: 11113,
    totalVaccinations: 11114,
    totalVaccinationsDose1: 11115,
    totalVaccinationsDose2: 11116,
    totalUndesirableReaction: 11117
};

export const dummyVoivodeships = [
    {
        id: "idv1",
        name: "n1",
        details: {
            newCases: 123,
            newDeaths: 123,
            newRecovered: 123,
            newDeathsWithComorbidities: 123,
            newDeathsWithoutComorbidities: 123,
            newTests: 123,
            newVaccinations: 123,
            newVaccinationsDose1: 123,
            newVaccinationsDose2: 123,
            totalVaccinations: 123,
            totalVaccinationsDose1: 123,
            totalVaccinationsDose2: 123,
        },
        districts: [
            {
                id: "idd1",
                uiId: 21,
                name: "n1",
                state: 1,
                newCases: 321,
                newDeaths: 321,
                newRecovered: 321,
                newDeathsWithComorbidities: 321,
                newDeathsWithoutComorbidities: 321,
                newTests: 321,
                newVaccinations: 321,
                newVaccinationsDose1: 321,
                newVaccinationsDose2: 321,
                totalVaccinations: 321,
                totalVaccinationsDose1: 321,
                totalVaccinationsDose2: 321,
            },
            {
                id: "idd2",
                uiId: 22,
                name: "n2",
                state: 2,
                newCases: 2,
                newDeaths: 2,
                newRecovered: 2,
                newDeathsWithComorbidities: 2,
                newDeathsWithoutComorbidities: 2,
                newTests: 2,
                newVaccinations: 2,
                newVaccinationsDose1: 2,
                newVaccinationsDose2: 2,
                totalVaccinations: 2,
                totalVaccinationsDose1: 2,
                totalVaccinationsDose2: 2,
            }]
    },
    {
        id: "idv2",
        name: "n2",
        details: {
            newCases: 3,
            newDeaths: 3,
            newRecovered: 3,
            newDeathsWithComorbidities: 3,
            newDeathsWithoutComorbidities: 3,
            newTests: 3,
            newVaccinations: 3,
            newVaccinationsDose1: 3,
            newVaccinationsDose2: 3,
            totalVaccinations: 3,
            totalVaccinationsDose1: 3,
            totalVaccinationsDose2: 3,
        },
        districts: [
            {
                id: "idd3",
                uiId: 23,
                name: "n3",
                state: 3,
                newCases: 4,
                newDeaths: 4,
                newRecovered: 4,
                newDeathsWithComorbidities: 4,
                newDeathsWithoutComorbidities: 4,
                newTests: 4,
                newVaccinations: 4,
                newVaccinationsDose1: 4,
                newVaccinationsDose2: 4,
                totalVaccinations: 4,
                totalVaccinationsDose1: 4,
                totalVaccinationsDose2: 4,
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
};

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