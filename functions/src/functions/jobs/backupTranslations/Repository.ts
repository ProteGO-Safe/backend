import axios, {AxiosInstance} from 'axios';

const baseURL = 'https://poeditor.com/api/';

class Repository {
    instance: AxiosInstance;

    constructor(token: string, projectId: number) {
        this.instance = axios.create({baseURL});
        this.instance.interceptors.request.use((_config) => {
            const {data} = _config;

            return {
                ..._config,
                data: `api_token=${token}&id=${projectId}&${data}`
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

const resolveRepository = (token: string, projectId: number) => new Repository(token, projectId).getInstance();

export default resolveRepository;
