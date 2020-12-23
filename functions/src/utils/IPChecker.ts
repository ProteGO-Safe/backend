import {secretManager} from "../services";
import {Netmask} from "netmask";

class IPChecker {
    private readonly configName: string;
    private readonly allowedNetmasks: Array<Netmask>;
    private allowAll = false;
    private initialized = false;

    constructor(configName: string) {
        this.configName = configName;
        this.allowedNetmasks = new Array<Netmask>();
    }

    async init(): Promise<void> {
        const netmasks = await secretManager.getConfig(this.configName);
        this.allowAll = netmasks.indexOf('*') !== -1;

        if (!this.allowAll) {
            for (const netmask of netmasks) {
                this.allowedNetmasks.push(new Netmask(netmask));
            }
        }
    }

    async allow(ip: string): Promise<boolean> {
        if (!this.initialized) {
            await this.init();
            this.initialized = true;
        }

        if (this.allowAll) {
            return true;
        }

        for (const netmask of this.allowedNetmasks) {
            if (netmask.contains(ip)) {
                return true;
            }
        }

        return false;
    }

}

export default IPChecker;
