import * as ff from 'firebase-functions';
import {SecretManagerServiceClient} from "@google-cloud/secret-manager/build/src";

class SecretManager {
    configuration: any;

    async getConfig(name: string): Promise<any> {
        if (!this.configuration) {
            const secretManagerPath = ff.config().config.secretmanagerpath;
            const secretManagerClient = new SecretManagerServiceClient();
            const [accessResponse] = await secretManagerClient.accessSecretVersion({name: secretManagerPath});
            this.configuration = JSON.parse(<string>accessResponse.payload?.data?.toString());
        }

        return this.configuration[name];
    }
}

export default SecretManager;
