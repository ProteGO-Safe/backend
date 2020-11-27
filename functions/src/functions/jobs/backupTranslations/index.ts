import axios from "axios";
import {secretManager} from "../../../config";
import {saveFileInStorage} from "../storageSaver";
import resolveRepository from "./Repository";

const listLanguagesCodes = async (): Promise<Array<string>> => {

    const {token, projectId} = await secretManager.getConfig('backupTranslations');
    const response = await resolveRepository(token, projectId).post('', 'action=list_languages');

    const {list} = response.data;

    return list.map((item: any) => item.code)
};

const generateUrl = async (language: string): Promise<string> => {

    const {token, projectId} = await secretManager.getConfig('backupTranslations');
    const response = await resolveRepository(token, projectId).post('', `action=export&type=key_value_json&language=${language}`);

    const {item} = response.data;

    return item
};

const throwError = (exception: string) => {
    throw new Error(exception)
};

const saveFile = async (json: any, language: string) => {
    const fileName = `${new Date().getTime()}_${language}.json`;
    const compress = true;

    const {archive} = await secretManager.getConfig('buckets');

    saveFileInStorage(json.data, fileName, archive, compress)
        .catch(throwError)
};

const fetchFile = (url: string, language: string) => {
    axios.get(url)
        .catch(throwError)
        .then(json => async () => await saveFile(json, language))
        .catch(throwError)
};

const processLanguage = (language: string) => {
    generateUrl(language)
        .catch(throwError)
        .then(url => fetchFile(url, language))
        .catch(throwError)
};

const backupTranslations = async () => {

    try {
        const languagesCodes = await listLanguagesCodes();
        languagesCodes.forEach(processLanguage);
    } catch (exception) {
        throw new Error(exception);
    }
};

export default backupTranslations;
