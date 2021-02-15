import {expect} from 'chai'
import createGensPayloadMessage from "../../../../src/functions/efgs/gensPayloadFactory";

describe('gensPayloadFactory', function () {
    it('should create Gens payload message', function () {
        const efgsData = "eyJiYXRjaFRhZyI6IjMyMzIzMiIsImtleXNEYXRhIjpbeyJrZXlEYXRhIjoiVEZnclVHTTRNWEE0UTBrdk1VcEdaR1ZSTTFjemR6MDkiLCJyb2xsaW5nU3RhcnRJbnRlcnZhbE51bWJlciI6MjY2NjQ0MCwicm9sbGluZ1BlcmlvZCI6MTQ0LCJ0cmFuc21pc3Npb25SaXNrTGV2ZWwiOjJ9LHsia2V5RGF0YSI6ImEzZHdiakZSZUVacVZFeERaVGwxUzJwSU9FOXFRVDA5Iiwicm9sbGluZ1N0YXJ0SW50ZXJ2YWxOdW1iZXIiOjI2NjYyOTYsInJvbGxpbmdQZXJpb2QiOjE0NCwidHJhbnNtaXNzaW9uUmlza0xldmVsIjo3fV19";

        const expectedGensPayloadMessage = {
            appPackageName: 'appPackageName',
            platform: 'android',
            regions: ['PL'],
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
        const gensPayloadMessage = createGensPayloadMessage(efgsData, 'appPackageName');
        expect(gensPayloadMessage).to.eql(expectedGensPayloadMessage)
    });
});
