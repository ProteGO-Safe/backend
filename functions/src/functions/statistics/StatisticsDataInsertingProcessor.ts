import * as fs from 'fs';
import {v4} from "uuid";
import {districtRepository, statisticsRepository, voivodeshipRepository} from "./services";
import createCovidInfo from "./jsons/CovidInfoJsonFactory";
import {createStatistic} from "./StatisticFactory";
import createDetailsJson from "./jsons/DetailsJsonFactory";
import fetchDistrictsStates from "./DistrictsStatesProcessor";
import parse = require("csv-parse/lib/sync");
import iconvlite = require('iconv-lite');
import createDistrictsJson from "./jsons/DistrictsJsonFactory";

const readContent = (fileName: string): string => {
    const content = fs.readFileSync(`${process.cwd()}/resources/${fileName}`);
    return iconvlite.decode(content, 'windows-1250');
};

const readContentAsArrays = async (fileName: string): Promise<Array<Array<string>>> => {
    const decoded = readContent(fileName);
    return await parse(decoded, {delimiter: ';'});
};

const processInsertingStatisticsData = async () => {

    const voivodeships = await readContentAsArrays('voivodeships.csv');
    const districts = await readContentAsArrays('districts.csv');
    const districtsStates = await readContent('202010230900_districts_states.csv');

    const date = new Date('2020-10-23T09:00:00');

    const existsAnyVoivodeship = await voivodeshipRepository.existsAny();
    const existsAnyDistrict = await districtRepository.existsAny();

    if (!existsAnyVoivodeship) {
        for (const voivodeship of voivodeships) {
            const externalId = voivodeship[1];
            const uiId = parseInt(voivodeship[2]);

            const data = {
                id: v4(),
                name: voivodeship[0],
                externalId,
                uiId
            };
            await voivodeshipRepository.save(data)
        }
    }

    const allVoivodeships = await voivodeshipRepository.listAll();

    if (!existsAnyDistrict) {

        for (const district of districts) {

            const voivodeship = allVoivodeships.find(value => value.name === district[0]);

            const data = {
                id: v4(),
                name: district[1],
                externalId: district[2],
                voivodeshipId: voivodeship!.id,
                uiId: parseInt(district[3])
            };

            await districtRepository.save(data)
        }
    }

    const existingStatisticsRepository = await statisticsRepository.getByTheSameDate(date);

    if (!existingStatisticsRepository) {
        const allDistricts = await districtRepository.listAll();

        const districtStates = await fetchDistrictsStates(allDistricts, districtsStates, null);

        const neverMindedGlobalStatistics = {
            totalCases: 0,
            totalDeaths: 0,
            totalRecovered: 0,
            totalVaccinations: 0,
            totalVaccinationsDose1: 0,
            totalVaccinationsDose2: 0,
            totalUndesirableReaction: 0
        };

        const neverMindedDashboardJson = {
            updated: 0,
            newCases: 0,
            newDeaths: 0,
            newRecovered: 0,
            newDeathsWithComorbidities: 0,
            newDeathsWithoutComorbidities: 0,
            newTests: 0,
            newVaccinations: 0,
            newVaccinationsDose1: 0,
            newVaccinationsDose2: 0,
            totalCases: 0,
            totalDeaths: 0,
            totalRecovered: 0,
            totalVaccinations: 0,
            totalVaccinationsDose1: 0,
            totalVaccinationsDose2: 0,
            totalUndesirableReaction: 0
        };

        const neverMindedDailyData = {
            newCases: 0,
            newDeaths: 0,
            newRecovered: 0,
            newDeathsWithComorbidities: 0,
            newDeathsWithoutComorbidities: 0,
            newTests: 0,
            newVaccinations: 0,
            newVaccinationsDose1: 0,
            newVaccinationsDose2: 0
        };

        const neverMindedDashboardData = {
            updated: 0,
            totalUndesirableReaction: 0,
            newDeathsWithComorbidities: 0,
            newDeathsWithoutComorbidities: 0,
            newTests: 0,
            newCases: 0,
            newDeaths: 0,
            newRecovered: 0,
            newVaccinations: 0,
            newVaccinationsDose1: 0,
            newVaccinationsDose2: 0,
            totalCases: 0,
            totalDeaths: 0,
            totalRecovered: 0,
            totalVaccinations: 0,
            totalVaccinationsDose1: 0,
            totalVaccinationsDose2: 0
        };

        const covidInfoJson = createCovidInfo(date, neverMindedDailyData, neverMindedGlobalStatistics, allVoivodeships, allDistricts, districtStates, null);
        const detailsJson = createDetailsJson(date, allVoivodeships, allDistricts, [], [], [], districtStates, neverMindedDashboardData);
        const districtsJson = createDistrictsJson(date, allVoivodeships, allDistricts, districtStates, null);
        const statistic = createStatistic(date, covidInfoJson, neverMindedDashboardJson, detailsJson, districtsJson, neverMindedDailyData);
        await statisticsRepository.save(statistic);
    }
};

export default processInsertingStatisticsData;
