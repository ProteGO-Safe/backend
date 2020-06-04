import axios from 'axios';
import {obtainHrefToReplace} from "./hrefRepleacer";
import config from "../config";
import moment = require("moment");

const { Storage } = require('@google-cloud/storage');

class Collapse {
    constructor(text: string, description: string) {
        this.text = text;
        this.description = description;
    }

    text: string;
    description: string;
}

class Paragraph {
    constructor() {
        this.paragraph = '';
        this.collapses = [];
    }

    paragraph: string;
    collapses: Collapse[];
}

class FaqItem {
    constructor(title: string) {
        this.title = title;
        this.paragraphs = [];
    }
    title: string;
    paragraphs: Paragraph[];
}

class Faq {

    intro: string;
    watermark: string;
    elements: FaqItem[] = [];

    verifyContent = () => {
        if (this.elements.length === 0) {
            throw new Error("elements size can not be 0");
        }

        this.elements.forEach(value => {
            const paragraphs = value.paragraphs

            paragraphs.forEach(value1 => {
                value1.collapses.forEach(value2 => {
                    if (value2.text === '') {
                        throw new Error("text can not be empty");
                    }
                    if (value2.description === '') {
                        throw new Error("description can not be empty");
                    }
                })

            })
        })
    }
}


const isNoEmptyParagraphElement = (element: Element) => {
    if (element.tagName.toLocaleLowerCase() !== 'p') {
        return false;
    }

    return element.textContent!.trim().replace('&nbsp;', '') !== '';
}

export const faqParser = async () => {

    const source = 'https://www.gov.pl/web/koronawirus/pytania-i-odpowiedzi';
    const { JSDOM } = require('jsdom');

    try {
        const response = await axios.get(source);

        const { data, status } = response;

        if (status !== 200) {
            throw new Error('Can not fetch html');
        }

        const dom = new JSDOM(data);

        const faq = new Faq();

        faq.intro = dom.window.document.querySelector('#main-content p.intro')
            .textContent;

        let faqItem: FaqItem;

        dom.window.document
            .querySelectorAll('#main-content div.editor-content')
            .forEach((editorContent: Element) => {
                const allEditorContentChildren = editorContent.querySelectorAll(
                    ':scope > *'
                );

                for (let i = 0; i < allEditorContentChildren.length; i ++) {
                    const child = allEditorContentChildren[i];
                    if (child.tagName.toLocaleLowerCase() === 'h3') {
                        faqItem = new FaqItem(child.textContent!);
                    } else if (i === 0) {
                        faqItem = new FaqItem('');
                    }
                    if (child.tagName.toLocaleLowerCase() === 'div') {
                        let paragraph: Paragraph = new Paragraph();
                        const allChildren = child.querySelectorAll(':scope > *');
                        for (let j = 0; j < allChildren.length; j ++) {
                            const _child = allChildren[j]
                            if (_child.tagName.toLocaleLowerCase() === 'p') {
                                if (_child.textContent!.trim()) {
                                    paragraph = new Paragraph()
                                    paragraph.paragraph = _child.textContent!;
                                }
                            }
                            if (_child.tagName.toLocaleLowerCase() === 'details') {
                                const question = _child.querySelector('summary')!.textContent;
                                const answerSelector = _child.querySelector('p')!;
                                const { text, toReplace } = obtainHrefToReplace(answerSelector);
                                let answer = answerSelector.textContent;
                                const ul = _child.querySelector('ul');
                                if (ul) {
                                    const items = ul.querySelectorAll(':scope > li');
                                    items.forEach(
                                        (value: Element) => (answer = `${answer}\n${value.textContent}`)
                                    );
                                }

                                answer = answer!.replace(
                                    'COVID-19',
                                    '[url]COVID-19|https://www.gov.pl/web/koronawirus[url]'
                                );

                                answer = answer.replace(text, toReplace!);
                                const collapse = new Collapse(question!, answer)
                                paragraph.collapses.push(collapse);
                            }

                            if (j === allChildren.length - 1 || isNoEmptyParagraphElement(allChildren[j + 1])) {
                                faqItem.paragraphs.push(paragraph);
                            }
                        }
                    }
                    if (i === allEditorContentChildren.length - 1 || allEditorContentChildren[i + 1].tagName.toLocaleLowerCase() === 'h3') {
                        faq.elements.push(faqItem);
                    }
                }
            });

        faq.verifyContent()

        faq.watermark = `${moment().format('YYYY-MM-D')} - ${source}`;

        const storage = new Storage();
        const bucket = storage.bucket(config.buckets.cdn);

        const file = bucket.file('faq.json');
        await file.save(JSON.stringify(faq));

    } catch (exception) {
        throw new Error(exception);
    }
};

export default faqParser;
