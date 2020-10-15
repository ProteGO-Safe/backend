import {expect} from 'chai'
import createGensPayloadMessage from "../../../../src/functions/efgs/gensPayloadFactory";

describe('gensPayloadFactory', function () {
    it('should create Gens payload message', function () {
        const efgsData = [{
            batchTag: "20201006-2",
            responseBody: {
                keys: [{
                    keyData: "TFgrUGM4MXA4Q0kvMUpGZGVRM1czdz09",
                    rollingStartIntervalNumber: 2666440,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 2,
                }, {
                    keyData: "a3dwbjFReEZqVExDZTl1S2pIOE9qQT09",
                    rollingStartIntervalNumber: 2666296,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 7,
                }]
            }
        }, {
            batchTag: "20201006-3",
            responseBody: {
                keys: [{
                    keyData: "enlQejhmRTQrbkdVNUxkUndsU3pkZz09",
                    rollingStartIntervalNumber: 2665584,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 1,
                }, {
                    keyData: "eEd4UzdXRVNDeVFDOUE0NENiYmpBUT09",
                    rollingStartIntervalNumber: 2669472,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 4,
                }, {
                    keyData: "NGNNUFVSenNXSVRCWkNNZGg2V1UvZz09",
                    rollingStartIntervalNumber: 2669328,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 8,
                }]
            }
        }, {
            batchTag: "20201006-4",
            responseBody: {
                keys: [{
                    keyData: "bHpKUkM1UDhFamJjWWJRUlV0OGhFUT09C",
                    rollingStartIntervalNumber: 2669184,
                    rollingPeriod: 144,
                    transmissionRiskLevel: 8,
                }]
            }
        }];
        const expectedGensPayloadMessage = {
            data: {
                temporaryExposureKeys: [
                    {
                        rollingPeriod: 144,
                        key: "LX+Pc81p8CI/1JFdeQ3W3w==",
                        rollingStartNumber: 2666440,
                        transmissionRisk: 2
                    },
                    {
                        rollingPeriod: 144,
                        key: "kwpn1QxFjTLCe9uKjH8OjA==",
                        rollingStartNumber: 2666296,
                        transmissionRisk: 7
                    },
                    {
                        rollingPeriod: 144,
                        key: "zyPz8fE4+nGU5LdRwlSzdg==",
                        rollingStartNumber: 2665584,
                        transmissionRisk: 1
                    },
                    {
                        rollingPeriod: 144,
                        key: "xGxS7WESCyQC9A44CbbjAQ==",
                        rollingStartNumber: 2669472,
                        transmissionRisk: 4
                    },
                    {
                        rollingPeriod: 144,
                        key: "4cMPURzsWITBZCMdh6WU/g==",
                        rollingStartNumber: 2669328,
                        transmissionRisk: 8
                    },
                    {
                        rollingPeriod: 144,
                        key: "lzJRC5P8EjbcYbQRUt8hEQ==",
                        rollingStartNumber: 2669184,
                        transmissionRisk: 8
                    },
                ]
            }
        };
        const gensPayloadMessage = createGensPayloadMessage(efgsData);
        expect(gensPayloadMessage).to.eql(expectedGensPayloadMessage)
    });
});
