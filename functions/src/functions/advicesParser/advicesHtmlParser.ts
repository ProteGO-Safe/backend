import moment = require("moment");
import {JSDOM} from 'jsdom';

import {URL} from "./advicesParser.constant";
import {Advice, AdviceItem} from "./advicesParser.types";
import {replaceOuterHtml} from "../outerHTMLReplacer";

export const parseHtml = (htmlContent: string) : Advice => {

    const dom = new JSDOM(htmlContent);

    const adviceItems: Array<AdviceItem> = [];

    dom.window.document
        .querySelector('.editor-content:last-child > div')!
        .querySelectorAll(':scope > details')
        .forEach((detailsElement: Element) => {
            const title = detailsElement.querySelector('summary')!.textContent;
            const reply = replaceOuterHtml(detailsElement.outerHTML, title!);
            const adviceItem = new AdviceItem(title!, reply);
            adviceItems.push(adviceItem);
        });

    const watermark = `${moment().format('YYYY-MM-D')} - ${URL}`;
    return new Advice(watermark, adviceItems);
};
