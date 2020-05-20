import {SecretManagerServiceClient} from "@google-cloud/secret-manager/build/src";
import config from "../config";

class SecretManager {
    configuration: any;

    async getConfig(name: string): Promise<any> {
        if (!this.configuration) {
            const secretManagerClient = new SecretManagerServiceClient();
            const [accessResponse] = await secretManagerClient.accessSecretVersion({name: config.secretManagerPath});
            this.configuration = JSON.parse(<string>accessResponse.payload?.data?.toString());
        }

        return this.configuration[name];
    }
}

export default SecretManager;
