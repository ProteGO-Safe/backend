import axios from 'axios';
import moment = require("moment");
import * as express from "express";
import config from "../config";
import {obtainHrefToReplace} from "./hrefRepleacer";

class AdviceItem {
    constructor(title: string, replies: Array<string>) {
        this.title = title;
        this.replies = replies;
    }

    title: string;
    replies: Array<string>;
}

class Advice {
    constructor(watermark: string, advices: Array<AdviceItem>) {
        this.watermark = watermark;
        this.advices = advices;
    }

    advices: Array<AdviceItem>;
    watermark: string;
}

const adviceItems: Array<AdviceItem> = [];

export const advicesParser = async (req: Request, res: express.Response) => {

    console.log("staring advicesParser")

    const source = 'https://www.gov.pl/web/koronawirus/porady';
    const { JSDOM } = require('jsdom');

    try {
        const response = await axios.get(source);

        const { data, status } = response;

        if (status !== 200) {
            throw new Error('Can not fetch html');
        }

        const dom = new JSDOM(data);

        dom.window.document
            .querySelector('.editor-content:last-child > div')
            .querySelectorAll(':scope > details')
            .forEach((detailsElement: Element) => {
                const replies: Array<string> = [];
                const title = detailsElement.querySelector('summary')!.textContent;
                if (detailsElement.querySelector('p') !== null) {
                    const answerSelector = detailsElement.querySelector('p')!;
                    const { text, toReplace } = obtainHrefToReplace(answerSelector);
                    let answer = answerSelector.textContent!;
                    answer = answer.replace(text, toReplace!);
                    replies.push(answer);
                } else if (detailsElement.querySelector('ul') != null) {
                    detailsElement
                        .querySelector('ul')!
                        .querySelectorAll(':scope > li')
                        .forEach(liElement => {
                            replies.push(liElement.textContent!);
                        });
                }
                const advice = new AdviceItem(title!, replies)
                adviceItems.push(advice);
            });

        const watermark = `${moment().format('YYYY-MM-D')} - ${source}`;
        const faq = new Advice(watermark, adviceItems);

        res.set('Cache-Control', `public, max-age=${config.cache.maxAge}, s-maxage=${config.cache.sMaxAge}`);
        res.status(200)
            .send(JSON.stringify(faq));

        console.log("finished advicesParser")

    } catch (exception) {
        throw new Error(exception);
    }
};

export default advicesParser;
