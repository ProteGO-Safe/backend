import {expect} from "chai";
import createCovidInfoJson from "../../../../src/functions/statistics/jsons/CovidInfoJsonFactory";
import Voivodeship from "../../../../src/functions/statistics/repository/Voivodeship";
import District from "../../../../src/functions/statistics/repository/District";
import DistrictState from "../../../../src/functions/statistics/DistrictState";
import {dummyStatistic} from "../dummyData";

describe('DailyDataFetcher tests', () => {

    const date = new Date('2021-02-01T11:23:32');

    const dailyData = {
        newCases: 1,
        newDeaths: 2,
        newRecovered: 3,
        newDeathsWithComorbidities: 4,
        newDeathsWithoutComorbidities: 5,
        newTests: 6,
        newVaccinations: 7,
        newVaccinationsDose1: 8,
        newVaccinationsDose2: 9
    };

    const globalStatistics = {
        totalCases: 10,
        totalDeaths: 11,
        totalRecovered: 12,
        totalVaccinations: 13,
        totalVaccinationsDose1: 14,
        totalVaccinationsDose2: 15,
        totalUndesirableReaction: 16,
    };

    it('should fetch daily data from minimal data', async () => {

        const voivodeships = [] as Voivodeship[];
        const districts = [] as District[];
        const districtStates = [] as DistrictState[];
        const lastStatistic = null;
        const covidInfoJson = createCovidInfoJson(date, dailyData, globalStatistics, voivodeships, districts, districtStates, lastStatistic);

        expect(covidInfoJson).to.be.eql({
            covidStats: {
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                totalCases: 10,
                totalDeaths: 11,
                totalRecovered: 12,
                updated: 1612178612
            },
            updated: 1612178612,
            voivodeships: [],
            voivodeshipsUpdated: 1612178612
        });
    });

    it('should fetch daily data from normal data', async () => {

        const voivodeships = [
            {
                id: "vid1",
                externalId: "veid1",
                uiId: 1,
                name: "namev1",
            },
            {
                id: "vid2",
                externalId: "veid2",
                uiId: 2,
                name: "namev2",
            }] as Voivodeship[];
        const districts = [
            {
                id: "did1",
                externalId: "deid1",
                voivodeshipId: "vid1",
                uiId: 3,
                name: "named1"
            },
            {
                id: "did2",
                externalId: "deid2",
                voivodeshipId: "vid2",
                uiId: 4,
                name: "named2"
            },
        ] as District[];
        const districtStates = [
            {
                districtId: "did1",
                state: 1
            },
            {
                districtId: "did2",
                state: 2
            }
        ] as DistrictState[];
        const lastStatistic = null;
        const covidInfoJson = createCovidInfoJson(date, dailyData, globalStatistics, voivodeships, districts, districtStates, lastStatistic);

        expect(covidInfoJson).to.be.eql({
            covidStats: {
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                totalCases: 10,
                totalDeaths: 11,
                totalRecovered: 12,
                updated: 1612178612
            },
            updated: 1612178612,
            voivodeships: [
                {
                    districts: [
                        {
                            id: 3,
                            name: "named1",
                            state: 1
                        }
                    ],
                    id: 1,
                    name: "namev1"
                },
                {
                    "districts": [
                        {
                            id: 4,
                            name: "named2",
                            state: 2
                        }
                    ],
                    id: 2,
                    name: "namev2"
                }
            ],
            voivodeshipsUpdated: 1612178612
        });
    });

    it('should fetch daily data from normal data and existing last statistic but voivodeships are the same', async () => {

        const voivodeships = [
            {
                id: "vid1",
                externalId: "veid1",
                uiId: 1,
                name: "n1",
            },
            {
                id: "vid2",
                externalId: "veid2",
                uiId: 2,
                name: "n2",
            }] as Voivodeship[];
        const districts = [
            {
                id: "did1",
                externalId: "deid1",
                voivodeshipId: "vid1",
                uiId: 2,
                name: "n1"
            },
            {
                id: "did2",
                externalId: "deid2",
                voivodeshipId: "vid1",
                uiId: 3,
                name: "n2"
            },
            {
                id: "did3",
                externalId: "deid2",
                voivodeshipId: "vid2",
                uiId: 4,
                name: "n3"
            }
        ] as District[];
        const districtStates = [
            {
                districtId: "did1",
                state: 1
            },
            {
                districtId: "did2",
                state: 2
            },
            {
                districtId: "did3",
                state: 3
            }
        ] as DistrictState[];

        const covidInfoJson = createCovidInfoJson(date, dailyData, globalStatistics, voivodeships, districts, districtStates, dummyStatistic);

        expect(covidInfoJson).to.be.eql({
            covidStats: {
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                totalCases: 10,
                totalDeaths: 11,
                totalRecovered: 12,
                updated: 1612178612
            },
            updated: 111,
            voivodeships: [
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
                }],
            voivodeshipsUpdated: 111
        });
    });

    it('should fetch daily data from normal data and existing last statistic and voivodeships are different', async () => {

        const voivodeships = [
            {
                id: "vid1",
                externalId: "veid1",
                uiId: 1,
                name: "namev1",
            },
            {
                id: "vid2",
                externalId: "veid2",
                uiId: 2,
                name: "namev2",
            }] as Voivodeship[];
        const districts = [
            {
                id: "did1",
                externalId: "deid1",
                voivodeshipId: "vid1",
                uiId: 3,
                name: "named1"
            },
            {
                id: "did2",
                externalId: "deid2",
                voivodeshipId: "vid2",
                uiId: 4,
                name: "named2"
            },
        ] as District[];
        const districtStates = [
            {
                districtId: "did1",
                state: 1
            },
            {
                districtId: "did2",
                state: 2
            }
        ] as DistrictState[];

        const covidInfoJson = createCovidInfoJson(date, dailyData, globalStatistics, voivodeships, districts, districtStates, dummyStatistic);

        expect(covidInfoJson).to.be.eql({
            covidStats: {
                newCases: 1,
                newDeaths: 2,
                newRecovered: 3,
                totalCases: 10,
                totalDeaths: 11,
                totalRecovered: 12,
                updated: 1612178612
            },
            updated: 1612178612,
            voivodeships: [
                {
                    districts: [
                        {
                            id: 3,
                            name: "named1",
                            state: 1
                        }
                    ],
                    id: 1,
                    name: "namev1"
                },
                {
                    "districts": [
                        {
                            id: 4,
                            name: "named2",
                            state: 2
                        }
                    ],
                    id: 2,
                    name: "namev2"
                }
            ],
            voivodeshipsUpdated: 1612178612
        });
    });
});
