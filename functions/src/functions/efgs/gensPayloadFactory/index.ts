const createGensPayloadMessage = (efgsData: any) => {
    return {
        temporaryExposureKeys: efgsData.map((item: any) => {
            const {keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel} = item;
            return {
                rollingPeriod: rollingPeriod,
                key: keyData,
                rollingStartNumber: rollingStartIntervalNumber,
                transmissionRisk: transmissionRiskLevel
            }
        })
    };
};

export default createGensPayloadMessage;
