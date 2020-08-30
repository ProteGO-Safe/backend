import {expect} from 'chai'
import {replaceOuterHtml} from '../../src/functions/outerHTMLReplacer';

describe('outerHTMLReplacer', function () {
    it('should replace html', function () {
        const outerHtml = '<details><summary>Czym jest koronawirus?</summary>\n                    <p>Jest to wirus RNA osłonięty błoną tłuszczową (lipidową).<a href="www.gov.pl" class="item active">\n        Title\n    </a></p>\n                </details>';
        const replacedHtml = replaceOuterHtml(outerHtml, 'Czym jest koronawirus?')
        expect(replacedHtml).equal('<p>Jest to wirus RNA osłonięty błoną tłuszczową (lipidową).<a target="_blank" href="www.gov.pl" class="item active">        Title    </a></p>')
    });
});
