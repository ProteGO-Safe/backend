import RandomCodeGenerator from "../utils/RandomCodeGenerator";
import CodeRepository from "../utils/CodeRepository";
import SubscriptionRepository from "../utils/SubscriptionRepository";

interface Config {
    code: {
        generator: RandomCodeGenerator,
        repository: CodeRepository
    },
    efgs: {
        gens: {
            regions: Array<string>,
            platform: string,
        }
    }
    subscription: {
        ios: {
            url: string
        },
        android: {
            url: string
        },
        repository : SubscriptionRepository,
    }
}

export default Config;
