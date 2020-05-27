import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import Config from "./interfaces/Config"
import CodeRepository from "./utils/CodeRepository";
import SecretManager from "./utils/SecretManager";
import IPChecker from "./utils/IPChecker";

const config: Config = {
    secretManagerPath: "/path/to/your/secret/object/versions/latest",
    exposureEndpoint: 'https://exposure.run.app/',
    buckets: {
        cdn: 'gs://somegcs.appspot.com'
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
    cache: {
        maxAge: 1800,
        sMaxAge: 1800
    }
}

export const secretManager = new SecretManager();
export const ipChecker = new IPChecker();

export default config;
