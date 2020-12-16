const config = {
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
    }
};

export default config;
