import {parseHtml} from "./advicesHtmlParser";
import {verifyContent} from "./advicesVerificator";
import {saveFileInStorage} from "../storageSaver";
import {fetchHtml} from "../htmlFetcher";
import {URL} from "./advicesParser.constant";


export const advicesParser = async () => {

    try {
        const data = await fetchHtml(URL);
        const advice = parseHtml(data);
        verifyContent(advice);
        saveFileInStorage(advice, 'advices.json')
            .catch(reason => {
                throw new Error(reason)
            })
    } catch (exception) {
        throw new Error(exception);
    }
};

export default advicesParser;
