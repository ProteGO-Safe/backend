import RandomCodeGenerator from "../utils/RandomCodeGenerator";
import CodeRepository from "../utils/CodeRepository";

declare type SUPPORTED_REGIONS = "us-central1" | "us-east1" | "us-east4" | "europe-west1" | "europe-west2" | "europe-west3" | "asia-east2" | "asia-northeast1";

interface Config {
    secretManagerPath: string,
    exposureEndpoint: string,
    buckets: {
        cdn: string
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
            diagnosisKeysCollectionName: string
        }
    }
}

export default Config;
