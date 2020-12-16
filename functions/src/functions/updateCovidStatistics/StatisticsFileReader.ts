import {Client, SFTPWrapper} from "ssh2";
import {error, log} from "firebase-functions/lib/logger";
import {FileEntry} from "ssh2-streams";
import config from "../../config";
import StatisticsFile from "./StatisticsFile";
import SecretManager from "../../utils/SecretManager";

class StatisticsFileReader {
    private sftpClient: SFTPWrapper;

    constructor(private readonly secretManager: SecretManager) {
    }

    async readLastNewCasesFile(): Promise<StatisticsFile|null> {
        return await this.readLastFile('woj');
    }

    async readLastTotalCasesFile(): Promise<StatisticsFile|null> {
        return await this.readLastFile('global');
    }

    private async readLastFile(searchName: string): Promise<StatisticsFile|null> {
        const
            filesList = await this.readDir(config.statistics.sshDirName),
            newestDate = this.resolveNewestDate(filesList),
            parsedNewestDate = this.parseDateString(newestDate);

        if (!parsedNewestDate) {
            error(`Cannot parse newest date from filename`, filesList, newestDate);
            return null;
        }

        const file = filesList.filter(entry => entry.filename.includes(newestDate) && entry.filename.includes(searchName)).pop();

        if (!file) {
            error(`Cannot read file content`, searchName, parsedNewestDate);
            return null;
        }

        return {
            date: parsedNewestDate,
            content:  await this.readFileContent(`${config.statistics.sshDirName}/${file.filename}`)
        };
    }

    private async resolveSftpClient(): Promise<SFTPWrapper> {
        if (this.sftpClient) {
            return this.sftpClient;
        }

        const {host, port, username, private_key} = await this.secretManager.getConfig('statistics');

        this.sftpClient = await new Promise(async (resolve, reject) => {
            const sshClient = new Client();
            sshClient.connect({
                host: <string> host,
                port: <number>  port,
                username: <string> username,
                privateKey: <string> private_key
            });

            sshClient.on('ready', () => {
                log(`ssh client connected and ready to use`);

                sshClient.sftp((err, sftp) => {
                    if (err) {
                        error(err)
                        reject(err);
                    }

                    log(`sftp  client connected and ready to use`)
                    resolve(sftp);
                })
            });

            sshClient.on('error', err => error(err));
        });

        return this.sftpClient;
    }

    private async readDir(dir: string): Promise<FileEntry[]> {
        const sftpClient = await this.resolveSftpClient();

        return new Promise(resolve => {
            sftpClient.readdir(dir, (err, list) => resolve(list));
        });
    }

    private async readFileContent(path: string): Promise<string> {
        const sftpClient = await this.resolveSftpClient();

        return new Promise(resolve => {
            sftpClient.readFile(path, (err, handle) => {
                resolve(handle.toString());
            });
        });
    }

    private resolveNewestDate(list: FileEntry[]): string {
        const newestElement =  list.reduce((previousValue, currentValue) => {
            const previousDate = parseInt(previousValue.filename);
            const currentDate = parseInt(currentValue.filename);

            return previousDate > currentDate ? previousValue : currentValue;
        });

        return parseInt(newestElement.filename).toString().substr(0, 8);
    }

    private parseDateString(dateString: string): Date|null {
        if (!dateString.match(/\d{8}/)) {
            return null;
        }

        const year = dateString.substr(0, 4);
        const month = parseInt(dateString.substr(4, 2)) - 1;
        const day = dateString.substr(6, 2);

        return new Date(parseInt(year), month, parseInt(day));
    }
}

export default StatisticsFileReader;
