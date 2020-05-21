import axios from 'axios';
import moment = require("moment");
const { Storage } = require('@google-cloud/storage');
import {obtainHrefToReplace} from "./hrefRepleacer";
import config from "../config";

class Content {
    constructor(text: string, reply: string) {
        this.text = text;
        this.reply = reply;
    }

    text: string;
    reply: string;
}

class FaqItem {
    constructor(type: string, content: Content) {
        this.type = type;
        this.content = content;
    }

    type: string;
    content: Content;
}

class Faq {
    constructor(watermark: string, elements: Array<FaqItem>) {
        this.watermark = watermark;
        this.elements = elements;
    }

    elements: Array<FaqItem>;
    watermark: string;
}

const faqItems: Array<FaqItem> = [];

const addItemToFaq = (text: string, reply: string, type: string) => {
    const content = new Content(text, reply);
    const faqItem = new FaqItem(type, content);
    faqItems.push(faqItem);
};

const verifyContent = () => {
    if (faqItems.length === 0) {
        throw new Error("elements size can not be 0");
    }

    faqItems.forEach(value => {
        const type = value.type;
        const text = value.content.text;
        const reply = value.content.reply;
        if (type === '') {
            throw new Error("type can not be empty");
        }
        if (text === '') {
            throw new Error("text can not be empty");
        }
        if (['intro', 'title', 'paragraph_strong'].includes(type) && reply !== '') {
            throw new Error("reply must be empty");
        }
        if (type === 'details' && reply === '') {
            throw new Error("reply can not be empty");
        }
    })
}

export const faqParser = async () => {

    console.log("staring faqParser")

    const source = 'https://www.gov.pl/web/koronawirus/pytania-i-odpowiedzi';
    const { JSDOM } = require('jsdom');

    try {
        const response = await axios.get(source);

        const { data, status } = response;

        if (status !== 200) {
            throw new Error('Can not fetch html');
        }

        const html = data.replace('&nbsp;', '')
            .replace(', a interesujące nas sprawy można zlokalizować, korzystając z wyszukiwarki', '');

        const dom = new JSDOM(html);

        const intro = dom.window.document.querySelector('#main-content p.intro')
            .textContent;

        addItemToFaq(intro, '', 'intro' );

        dom.window.document
            .querySelectorAll('#main-content div.editor-content')
            .forEach((editorContent: Element) => {
                const allEditorContentChildren = editorContent.querySelectorAll(
                    ':scope > *'
                );

                allEditorContentChildren.forEach((child: Element) => {
                    if (child.tagName.toLocaleLowerCase() === 'h3') {
                        addItemToFaq(child.textContent!, '', 'title' );
                    }
                    if (child.tagName.toLocaleLowerCase() === 'div') {
                        const allChildren = child.querySelectorAll(':scope > *');
                        allChildren.forEach(_child => {
                            if (_child.tagName.toLocaleLowerCase() === 'p') {
                                if (_child.textContent!.trim()) {
                                    addItemToFaq(_child.textContent!,'', 'paragraph_strong');
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

                                addItemToFaq(question!, answer, 'details');
                            }
                        });
                    }
                });
            });

        verifyContent()

        const watermark = `${moment().format('YYYY-MM-D')} - ${source}`;
        const faq = new Faq(watermark, faqItems);

        const storage = new Storage();
        const bucket = storage.bucket(config.buckets.cdn);

        const file = bucket.file('faq.json');
        file.save(JSON.stringify(faq)).then(() => console.log("finished faqParser"));

    } catch (exception) {
        throw new Error(exception);
    }
};

export default faqParser;
