import {Client, SFTPWrapper} from "ssh2";
import {error, log} from "firebase-functions/lib/logger";
import {FileEntry} from "ssh2-streams";
import config from "../../config";
import SecretManager from "../../utils/SecretManager";
import {getJoinedDateAsString} from "../../utils/dateUtils";
import FileNotFoundError from "./errors/FileNotFoundError";
import File from "./File";
import iconvlite = require('iconv-lite');

class StatisticsFileReader {
    private sftpClient: SFTPWrapper;

    constructor(private readonly secretManager: SecretManager) {
    }

    async readRcbDistrictsFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_pow_eksport.csv', date, config.statistics.sshDirName);
    }
    async readRcbVoivodeshipsFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_woj_eksport.csv', date, config.statistics.sshDirName);
    }

    async readRcbDistrictVaccinationsFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_pow_szczepienia.csv', date, config.statistics.sshDirVaccinationsName);
    }
    async readRcbVoivodeshipsVaccinationsFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_woj_szczepienia.csv', date, config.statistics.sshDirVaccinationsName);
    }

    async readRcbGlobalFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_global_eksport.csv', date, config.statistics.sshDirName);
    }

    async readRcbGlobalVaccinationsFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_global_szczepienia.csv', date, config.statistics.sshDirVaccinationsName);
    }

    async readDistrictStatesFileByDate(date: Date): Promise<File | null> {
        try {
            return await this.readFile('_districts_states.csv', date, config.statistics.sshDirName);
        } catch (e) {
            if(e instanceof FileNotFoundError) {
                return null;
            } else {
                throw e;
            }
        }
    }

    async readRcbGlobalVaccinationsOtherFileByDate(date: Date): Promise<File> {
        return await this.readFile('_rap_rcb_global_szczepienia_inne.csv', date, config.statistics.sshDirVaccinationsName);
    }

    private async readFile(searchName: string, date: Date, dir: string): Promise<File> {
        const filesList = await this.readDir(dir);

        const dateAsString = getJoinedDateAsString(date);

        const file = filesList.filter(entry => entry.filename.includes(dateAsString) && entry.filename.includes(searchName)).pop();

        if (!file) {
            const message = `no file found for search ${searchName} and date ${date}`;
            log(message);
            throw new FileNotFoundError(message)
        }

        // @ts-ignore
        const {filename} = file;

        const fileContent = await this.readFileContent(`${dir}/${filename}`);
        const decoded = iconvlite.decode(fileContent, 'win1250');
        log(`for searchName: ${searchName} and date: ${date} founded file with name ${filename} and content: ${decoded}`);
        return new File(filename, decoded);
    }

    private async resolveSftpClient(): Promise<SFTPWrapper> {
        if (this.sftpClient) {
            return this.sftpClient;
        }

        const {host, port, username, private_key} = await this.secretManager.getConfig('statistics');

        this.sftpClient = await new Promise(async (resolve, reject) => {
            const sshClient = new Client();
            sshClient.connect({
                host: <string>host,
                port: <number>port,
                username: <string>username,
                privateKey: <string>private_key
            });

            sshClient.on('ready', () => {
                log(`ssh client connected and ready to use`);

                sshClient.sftp((err, sftp) => {
                    if (err) {
                        error(err)
                        reject(err);
                    }

                    log(`sftp  client connected and ready to use`);
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

    private async readFileContent(path: string): Promise<Buffer> {
        const sftpClient = await this.resolveSftpClient();

        return new Promise(resolve => {
            sftpClient.readFile(path, (err, handle) => {
                resolve(handle);
            });
        });
    }
}

export default StatisticsFileReader;
