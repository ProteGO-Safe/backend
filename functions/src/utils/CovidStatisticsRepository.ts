import {Bucket, Storage} from "@google-cloud/storage";
import config from "../config";
import CovidStats from "./CovidStats";
import {secretManager} from "../services";
import errorLogger from "../functions/logger/errorLogger";
import errorEntryLabels from "../functions/logger/errorEntryLabels";

class CovidStatisticsRepository {
    private bucket: Bucket;

    async getBucket(): Promise<Bucket> {
        if (!this.bucket) {
            await this.init();
        }

        return this.bucket;
    }

    async getCovidStats(): Promise<CovidStats> {
        const content = await this.loadFile();

        return new CovidStats(
            content.covidStats.updated ?? null,
            content.covidStats.newCases ?? null,
            content.covidStats.totalCases ?? null,
            content.covidStats.newDeaths ?? null,
            content.covidStats.totalDeaths ?? null,
            content.covidStats.newRecovered ?? null,
            content.covidStats.totalRecovered ?? null,
            content.covidStats.newVaccinations ?? null,
            content.covidStats.totalVaccinations ?? null,
            content.covidStats.newVaccinationsDose1 ?? null,
            content.covidStats.totalVaccinationsDose1 ?? null,
            content.covidStats.newVaccinationsDose2 ?? null,
            content.covidStats.totalVaccinationsDose2 ?? null,
        );
    }

    async save(covidStats: CovidStats): Promise<void> {
        const fileContent = await this.loadFile(), bucket = await this.getBucket();

        fileContent.covidStats = covidStats;

        bucket
            .file(config.statistics.fileName)
            .save(
                JSON.stringify(fileContent),
            err => {err ? errorLogger.error(errorEntryLabels(`Cannot save file`), err) : undefined}
            );
    }

    private async loadFile(): Promise<any> {
        const bucket = await this.getBucket();

        return new Promise((resolve, reject) => {
            bucket.file(config.statistics.fileName).download((err, contents) => {
                if (err) {
                    errorLogger.error(errorEntryLabels(`cannot read covidStats file`), err);
                    reject(err);
                }

                const content = contents ? JSON.parse(contents.toString()) : {covidStats: {}};

                resolve(content);
            });
        })
    }

    private async init(): Promise<void> {
        const {bucketName} = await secretManager.getConfig('statistics');

        this.bucket = new Storage().bucket(bucketName);
    }
}

export default CovidStatisticsRepository;
