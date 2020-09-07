const replaceSpace = (text: string) => {
    return text.replace(/&nbsp;/g, ' ')
        .replace(/\xA0/g,' ');
};

export const replaceOuterHtml = (html: string, avoidedFragment: string) : string => {
    let replacedHtml = html;
    replacedHtml = replaceSpace(replacedHtml);
    replacedHtml = replacedHtml.replace('<details>', '');
    replacedHtml = replacedHtml.replace('</details>', '');
    replacedHtml = replacedHtml.replace(`<summary>${replaceSpace(avoidedFragment)}</summary>`, '');
    replacedHtml = replacedHtml.replace('COVID-19', '<a href="https://www.gov.pl/web/koronawirus" target="_blank">COVID-19</a>');
    replacedHtml = replacedHtml.replace('<a href', '<a target=\"_blank\" href');
    replacedHtml = replacedHtml.replace(/\n/g, '');
    return replacedHtml.trim();
};
