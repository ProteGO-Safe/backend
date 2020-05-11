import RandomCodeGenerator from "../utils/RandomCodeGenerator";
import CodeRepository from "../utils/CodeRepository";
import SecretManager from "../utils/SecretManager";

declare type SUPPORTED_REGIONS = "us-central1" | "us-east1" | "us-east4" | "europe-west1" | "europe-west2" | "europe-west3" | "asia-east2" | "asia-northeast1";

interface Config {
    secretManagerApiTokenPath: string,
    regions: SUPPORTED_REGIONS[],
    code: {
        generator: RandomCodeGenerator,
        lifetime: number //in minutes
        repository: CodeRepository
    },
    secretManager: SecretManager;
}

export default Config;