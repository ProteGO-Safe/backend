import {EfgsItem, EfgsKey, GensItem, ReportType, TemporaryExposureKey} from "../efgs.types";

const createEfgsItem = (temporaryExposureKey: TemporaryExposureKey) => {
    return new EfgsKey(
        temporaryExposureKey.key,
        temporaryExposureKey.rollingStartNumber,
        temporaryExposureKey.rollingPeriod,
        temporaryExposureKey.transmissionRisk,
        ['DE'],
        'PL',
        ReportType.CONFIRMED_CLINICAL_DIAGNOSIS,
        42
    )
};

export const efgsDiagnosisKeysFactory = (gensItem: GensItem) => {

    const efgsKeys = gensItem
        .data
        .temporaryExposureKeys
        .map(value => createEfgsItem(value))

    return new EfgsItem(efgsKeys)
};


export default efgsDiagnosisKeysFactory;
