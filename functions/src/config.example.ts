import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import Config from "./interfaces/Config"
import CodeRepository from "./utils/CodeRepository";
import HashedAccessTokensRepository from "./utils/HashedAccessTokensRepository";
import SubscriptionRepository from "./utils/SubscriptionRepository";
import SecretManager from "./utils/SecretManager";
import IPChecker from "./utils/IPChecker";

const config: Config = {
    secretManagerPath: "/path/to/your/secret/object/versions/latest",
    exposureEndpoint: 'https://exposure.run.app/',
    exposureTimeout: 10000,
    buckets: {
        cdn: 'gs://somegcs.appspot.com',
        archive: 'gs://somegcs'
    },
    regions: ["europe-west3"],
    code: {
        generator: new RandomCodeGenerator(6),
        lifetime: 30,
        repository: new CodeRepository(),
        hashedAccessTokensRepository: new HashedAccessTokensRepository()
    },
    jwt: {
        lifetime: 30
    },
    cache: {
        maxAge: 1800,
        sMaxAge: 1800
    },
    backupTranslations: {
        token: "1234",
        projectId: 123
    },
    subscription: {
        ios: {
            url: 'https://api.development.devicecheck.apple.com/v1/query_two_bits'
        },
        android: {
            url: 'https://www.googleapis.com/androidcheck/v1/attestations/verify'
        },
        repository: new SubscriptionRepository(),
        disabledSafetyToken: false
    },
    efgs: {
        gens: {
            regions: ['PL'],
            appPackageName: 'appPackageName',
            platform: '',
        }
    }
};

export const secretManager = new SecretManager();
export const generateCodeIPChecker = new IPChecker('generateCodeNetmasks');
export const applicationIPChecker = new IPChecker('applicationNetmasks');

export default config;
