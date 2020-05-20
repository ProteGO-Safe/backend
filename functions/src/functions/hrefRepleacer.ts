export const obtainHrefToReplace = (selector: HTMLParagraphElement) => {
    const { JSDOM } = require('jsdom');
    const html = selector.innerHTML;
    const aHref = new JSDOM(html).window.document.querySelector('a');
    if (!aHref) {
        return {};
    }
    const { text } = aHref;
    const toReplace = `[url]${text}|${aHref.getAttribute('href')}[url]`;

    return { text, toReplace };
};
