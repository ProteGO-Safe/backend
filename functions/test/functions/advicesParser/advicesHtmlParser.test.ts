import {expect} from 'chai'
import {parseHtml} from '../../../src/functions/advicesParser/advicesHtmlParser';

describe('advicesHtmlParser', function () {
    it('should parse html', function () {
        const exceptedNumberOfAdvices = 18;
        const fs = require('fs');
        const fileContent = fs.readFileSync('./test/functions/advicesParser/content.html', 'utf8');
        const exceptedJson = fs.readFileSync('./test/functions/advicesParser/exceptedJson.json', 'utf8');
        const exceptedAdvices = JSON.parse(exceptedJson).advices;
        const advice = parseHtml(fileContent);
        expect(advice).to.have.property('advices').with.lengthOf(exceptedNumberOfAdvices);
        for (let i = 0; i < exceptedNumberOfAdvices; i++) {
            expect(advice.advices[i].title).to.equal(exceptedAdvices[i].title);
            expect(advice.advices[i].reply).to.equal(exceptedAdvices[i].reply);
        }
    });
});
