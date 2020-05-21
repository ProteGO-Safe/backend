import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import Config from "./interfaces/Config"
import CodeRepository from "./utils/CodeRepository";
import SecretManager from "./utils/SecretManager";

const config: Config = {
    secretManagerPath: "/path/to/your/secret/object/versions/latest",
    buckets: {
        diagnosisKeys: 'gs://upload-bucket-test',
        cdn: 'safesafe-test-cdn'
    },
    regions: ["europe-west3"],
    code: {
        generator: new RandomCodeGenerator(6),
        lifetime: 30,
        repository: new CodeRepository()
    },
    jwt: {
        lifetime: 30
    },
    secretManager: new SecretManager(),
    cache: {
        maxAge: 1800,
        sMaxAge: 1800
    }
}

export default config;
