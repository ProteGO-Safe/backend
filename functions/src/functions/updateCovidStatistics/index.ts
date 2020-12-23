import {covidStatisticsRepository, statisticsFileParser} from "../../services";
import {logger} from "firebase-functions";
import sendStatisticsNotification from "../notification/sendStatisticsNotification";
import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import {Storage} from "@google-cloud/storage";
import {log} from "firebase-functions/lib/logger";

const updateCovidStatistics = async (object : ObjectMetadata) => {
    if (!object.name || !object.name.match(/covid-stats\/\d{8}_covid_stats/)) {
        log('The finalized object doesnt match', object.name)
        log(object)
        return;
    }

    const fileContent = await downloadFileContent(object);
    const newestStatistics = await statisticsFileParser.parse(fileContent, object.name);
    const covidStatistics = await covidStatisticsRepository.getCovidStats();

    if (!newestStatistics.updated) {
        logger.info('Updated timestamp is wrong', newestStatistics.updated, object.name);
        return;
    }

    log(`Read current saved covid statistics`, covidStatistics);
    log(`Read newest covid statistics`, newestStatistics);

    if (covidStatistics.updated && newestStatistics.updated && covidStatistics.updated >= newestStatistics.updated) {
        logger.info('Nothing to update.');
        return;
    }

    await covidStatisticsRepository.save(newestStatistics);
    log('Saved new statistics to the bucket');

    await sendStatisticsNotification(newestStatistics);
    log('Pushed notification');
}

const downloadFileContent = async (object: ObjectMetadata): Promise<string> => {
    return new Promise((resolve, reject) => {
        (new Storage())
            .bucket(object.bucket)
            .file(<string> object.name)
            .download((err, contents) => {
                if (err) {
                    reject(err);
                }

                resolve(contents.toString())
            });
    });
}

export default updateCovidStatistics;
