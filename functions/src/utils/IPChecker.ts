import {secretManager} from "../config";

class IPChecker {
    private allowAll = false;
    private allowedIps: Array<string>;

    async init(): Promise<void> {
        this.allowedIps = await secretManager.getConfig('allowedIps');
        this.allowAll = this.allowedIps.indexOf('*') !== -1;
    }

    async allow(ip: string): Promise<boolean> {
        if (!this.allowedIps) {
            await this.init();
        }

        if (this.allowAll) {
            return true;
        }

        return this.allowedIps.indexOf(ip) !== -1;
    }

}

export default IPChecker;
