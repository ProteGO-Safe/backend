const createGensPayloadMessage = (efgsData: any) => {

    const {batches} = efgsData;

    return batches.reduce((obj: any, item: any) => {
        const {temporaryExposureKeys} = obj;
        const {keys} = item;
        const mappedKeys = keys.map((_item: any) => {
            const {keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel} = _item;
            return {
                rollingPeriod: rollingPeriod,
                key: Buffer.from(keyData, 'base64').toString(),
                rollingStartNumber: rollingStartIntervalNumber,
                transmissionRisk: transmissionRiskLevel
            }
        });
        return {temporaryExposureKeys: [...temporaryExposureKeys, ...mappedKeys]}

    }, {temporaryExposureKeys: []})
};

export default createGensPayloadMessage;