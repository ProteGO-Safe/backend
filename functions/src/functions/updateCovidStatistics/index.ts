import {covidStatisticsRepository, statisticsFileParser} from "../../services";
import {logger} from "firebase-functions";
import sendStatisticsNotification from "../notification/sendStatisticsNotification";
import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import {Storage} from "@google-cloud/storage";
import {log} from "firebase-functions/lib/logger";

const updateCovidStatistics = async (object : ObjectMetadata) => {
    if (!object.name || !object.name.match(/\d{8}_covid_stats/)) {
        log('The finalized object doesnt match')
        log(object)
        return;
    }

    const fileContent = await downloadFileContent(object);
    const newestStatistics = await statisticsFileParser.parse(fileContent);
    const covidStatistics = await covidStatisticsRepository.getCovidStats();

    newestStatistics.updated = resolveDatetimeFromFilename(object.name);

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

const resolveDatetimeFromFilename = (filename: string) : number => {
    const dateString = parseInt(filename).toString().substr(0, 8);

    const year = dateString.substr(0, 4);
    const month = parseInt(dateString.substr(4, 2)) - 1;
    const day = dateString.substr(6, 2);

    return new Date(parseInt(year), month, parseInt(day)).getTime() / 1000;
}

export default updateCovidStatistics;
