import {SecretManagerServiceClient} from "@google-cloud/secret-manager/build/src";
import config from "../config";

class SecretManager {
    private apiToken: string;

    async getApiToken(): Promise<string> {
        if (!this.apiToken) {
            const secretManagerClient = new SecretManagerServiceClient();
            const [accessResponse] = await secretManagerClient.accessSecretVersion({name: config.secretManagerApiTokenPath});
            this.apiToken = <string>accessResponse.payload?.data?.toString();
        }

        return this.apiToken;
    }
}

export default SecretManager;
