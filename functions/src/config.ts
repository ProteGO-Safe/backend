import * as ff from "firebase-functions";

const region = ff.config().config.region;

const config = {
    notificationUrl: "https://fcm.googleapis.com/fcm/send",
    code: {
        lifetime: 30, // in minutes
    },
    jwt: {
        lifetime: 30 // in minutes
    },
    efgs: {
        gens: {
            regions: ['PL'],
            platform: 'android',
        },
        failedGens: {
            retries: 3,
            limit: 100,
            retryExpirationDays: 14
        }
    },
    statistics: {
        fileName: 'covid_info.json',
        sshDirName: '/home/stopcovid',
        sshDirVaccinationsName: '/home/stopcovid/SzczepieniaRCB',
        publishTime: '10:30',
        lastDaysDetails: 14,
        files: {
            covidInfo: 'covid_info.json',
            timestamps: '2/timestamps.json',
            dashboard: '2/dashboard.json',
            details: '2/details.json',
            districts: '2/districts.json',
        }
    },
    metrics: {
        uploadedKeyMetricTopicName: `firebase-subscription-sendUploadedKeysOpenCensusMetricSubscriber-${region}`,
        uploadedKeyMetricName: 'metrics/uploaded_keys',
        uploadedKeyMetricInterval: 60,
        uploadedKeyMetricDescription: 'The number of keys uploaded'
    }
};

export default config;
