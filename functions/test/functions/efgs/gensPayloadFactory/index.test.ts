import {expect} from 'chai'
import createGensPayloadMessage from "../../../../src/functions/efgs/gensPayloadFactory";

describe('gensPayloadFactory', function () {
    it('should create Gens payload message', function () {
        const efgsData = [
                {
                    keyData: "TFgrUGM4MXA4Q0kvMUpGZGVRM1czdz09",
                    rollingStartIntervalNumber: 2666440,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 2,
                }, {
                    keyData: "a3dwbjFReEZqVExDZTl1S2pIOE9qQT09",
                    rollingStartIntervalNumber: 2666296,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 7,
                }
            ]
        ;

        const expectedGensPayloadMessage = {
            temporaryExposureKeys: [
                {
                    rollingPeriod: 144,
                    key: "TFgrUGM4MXA4Q0kvMUpGZGVRM1czdz09",
                    rollingStartNumber: 2666440,
                    transmissionRisk: 2
                },
                {
                    rollingPeriod: 144,
                    key: "a3dwbjFReEZqVExDZTl1S2pIOE9qQT09",
                    rollingStartNumber: 2666296,
                    transmissionRisk: 7
                }
            ]
        };
        const gensPayloadMessage = createGensPayloadMessage(efgsData);
        expect(gensPayloadMessage).to.eql(expectedGensPayloadMessage)
    });
});
