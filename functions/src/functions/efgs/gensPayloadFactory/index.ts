const createGensPayloadMessage = (efgsData: any) => {

    return efgsData.reduce((obj: any, item: any) => {
        const {data: {temporaryExposureKeys}} = obj;
        const {responseBody: {keys}} = item;
        const mappedKeys = keys.map((item: any) => {
            const {keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel} = item;
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