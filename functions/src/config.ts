import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import Config from "./interfaces/Config"
import CodeRepository from "./utils/CodeRepository";
import SubscriptionRepository from "./utils/SubscriptionRepository";
import SecretManager from "./utils/SecretManager";
import IPChecker from "./utils/IPChecker";

const config: Config = {
    code: {
        generator: new RandomCodeGenerator(6),
        repository: new CodeRepository()
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
        },
        repository: new SubscriptionRepository(),
    }
};
export const secretManager = new SecretManager();
export const generateCodeIPChecker = new IPChecker('generateCodeNetmasks');
export const applicationIPChecker = new IPChecker('applicationNetmasks');
export default config;
