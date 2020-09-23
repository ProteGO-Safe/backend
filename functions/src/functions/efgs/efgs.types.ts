export class GensItem {
    constructor(id: string, data: GensItemData, allowSentToEfgs: boolean) {
        this.id = id;
        this.data = data;
        this.allowSentToEfgs = allowSentToEfgs;
    }

    id: string;
    data: GensItemData;
    allowSentToEfgs: boolean;
}

export class TemporaryExposureKey {
    constructor(rollingPeriod: number,
                key: string,
                rollingStartNumber: number,
                transmissionRisk: number) {
        this.rollingPeriod = rollingPeriod;
        this.key = key;
        this.rollingStartNumber = rollingStartNumber;
        this.transmissionRisk = transmissionRisk;
    }

    rollingPeriod: number;
    key: string;
    rollingStartNumber: number;
    transmissionRisk: number;
}

export class GensItemData {
    constructor(verificationPayload: string,
                temporaryExposureKeys: Array<TemporaryExposureKey>,
                regions: Array<string>,
                appPackageName: string,
                platform: string) {
        this.verificationPayload = verificationPayload;
        this.temporaryExposureKeys = temporaryExposureKeys;
        this.regions = regions;
        this.appPackageName = appPackageName;
        this.platform = platform;
    }

    verificationPayload: string;
    temporaryExposureKeys: Array<TemporaryExposureKey>;
    regions: Array<string>;
    appPackageName: string;
    platform: string;
}

export class EfgsKey {
    constructor(keyData: string,
                rollingStartIntervalNumber: number,
                rollingPeriod: number,
                transmissionRiskLevel: number,
                visitedCountries: Array<string>,
                origin: string,
                reportType: ReportType,
                days_since_onset_of_symptoms: number) {
        this.keyData = keyData;
        this.rollingStartIntervalNumber = rollingStartIntervalNumber;
        this.rollingPeriod = rollingPeriod;
        this.transmissionRiskLevel = transmissionRiskLevel;
        this.visitedCountries = visitedCountries;
        this.origin = origin;
        this.reportType = reportType;
        this.days_since_onset_of_symptoms = days_since_onset_of_symptoms;

    }

    keyData: string;
    rollingStartIntervalNumber: number;
    rollingPeriod: number;
    transmissionRiskLevel: number;
    visitedCountries: Array<string>;
    origin: string;
    reportType: ReportType;
    days_since_onset_of_symptoms: number;
}

export enum ReportType {
    UNKNOWN,
    CONFIRMED_TEST,
    CONFIRMED_CLINICAL_DIAGNOSIS,
    SELF_REPORT,
    RECURSIVE,
    REVOKED,
}

export class EfgsItem {
    constructor(keys: Array<EfgsKey>) {
        this.keys = keys;
    }

    keys: Array<EfgsKey>;
}

