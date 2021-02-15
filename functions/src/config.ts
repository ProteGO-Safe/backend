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
    subscription: {
        ios: {
            url: 'https://api.development.devicecheck.apple.com/v1/query_two_bits'
        },
        android: {
            url: 'https://www.googleapis.com/androidcheck/v1/attestations/verify'
        }
    },
    statistics: {
        fileName: 'covid_info.json',
        sshDirName: '/home/stopcovid'
    },
    metrics: {
        uploadedKeyMetricTopicName: `firebase-subscription-sendUploadedKeysOpenCensusMetricSubscriber-${region}`,
        uploadedKeyMetricName: 'metrics/uploaded_keys',
        uploadedKeyMetricInterval: 60,
        uploadedKeyMetricDescription: 'The number of keys uploaded'
    }
};

export default config;
