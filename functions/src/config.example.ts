import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import Config from "./interfaces/Config"
import CodeRepository from "./utils/CodeRepository";
import SecretManager from "./utils/SecretManager";

const config: Config = {
    secretManagerApiTokenPath: "/path/to/your/secret/object/versions/latest",
    regions: ["europe-west3"],
    code: {
        generator: new RandomCodeGenerator(6),
        lifetime: 30,
        repository: new CodeRepository()
    },
    secretManager: new SecretManager()
}

export default config;
