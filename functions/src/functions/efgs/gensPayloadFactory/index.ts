const createGensPayloadMessage = (efgsData: any) => {

    return efgsData.reduce((obj: any, item: any) => {
        const {data: {temporaryExposureKeys}} = obj;
        const {responseBody: {keys}} = item;
        const mappedKeys = keys.map((_item: any) => {
            const {keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel} = _item;
            return {
                rollingPeriod: rollingPeriod,
                key: Buffer.from(keyData, 'base64').toString(),
                rollingStartNumber: rollingStartIntervalNumber,
                transmissionRisk: transmissionRiskLevel
            }
        });
        return {data: {temporaryExposureKeys: [...temporaryExposureKeys, ...mappedKeys]}}

    }, {data: {temporaryExposureKeys: []}})
};

export default createGensPayloadMessage;