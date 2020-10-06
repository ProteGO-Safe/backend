import axios, {AxiosInstance} from 'axios';
import config from "../../config";

const baseURL = 'https://poeditor.com/api/';

class Repository {
    instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({baseURL});
        this.instance.interceptors.request.use((_config) => {
            const {data} = _config;

            return {
                ..._config,
                data: `api_token=${config.backupTranslations.token}&id=${config.backupTranslations.projectId}&${data}`
            };
        });
        this.instance.interceptors.response.use((response) => {
            const {response: {code}} = response.data;
            if (code !== '200') {
                throw new Error('illegal api request');
            }
            return Promise.resolve(response)
        });
    }

    getInstance() {
        return this.instance;
    }
}

const resolveRepository = () => new Repository().getInstance();

export default resolveRepository;
