import RandomCodeGenerator from "../utils/RandomCodeGenerator";
import CodeRepository from "../utils/CodeRepository";
import SubscriptionRepository from "../utils/SubscriptionRepository";

declare type SUPPORTED_REGIONS = "us-central1" | "us-east1" | "us-east4" | "europe-west1" | "europe-west2" | "europe-west3" | "asia-east2" | "asia-northeast1";

interface Config {
    secretManagerPath: string,
    exposureEndpoint: string,
    buckets: {
        cdn: string,
        archive: string
    },
    regions: SUPPORTED_REGIONS[],
    code: {
        generator: RandomCodeGenerator,
        lifetime: number //in minutes
        repository: CodeRepository
    },
    jwt: {
        lifetime: number //in minutes
    }
    cache: {
        maxAge: number, // in seconds
        sMaxAge: number // in seconds
    },
    efgs: {
        firestore: {
            diagnosisKeysCollectionName: string,
            failedUploadingToGensDiagnosisKeysCollectionName: string
        },
        gens: {
            regions: Array<string>,
            appPackageName: string,
            platform: string,
        }
    }
    backupTranslations: {
        token: string,
        projectId: number
    },
    subscription: {
        ios: {
            url: string
        },
        android: {
            url: string
        },
        repository : SubscriptionRepository,
        disabledSafetyToken: boolean
    }
}

export default Config;
