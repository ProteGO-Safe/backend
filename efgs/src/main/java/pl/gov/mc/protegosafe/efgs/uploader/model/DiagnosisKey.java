package pl.gov.mc.protegosafe.efgs.uploader.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class DiagnosisKey {
    public static final Integer DAYS_SINCE_ONSET_OF_SYMPTOMS = 4000;

    private final String keyData;
    private final Integer rollingStartIntervalNumber;
    private final Integer rollingPeriod;
    private final Integer transmissionRiskLevel;
    private final List<String> visitedCountries;
    private final String origin;
    private final ReportType reportType;
    private final Integer daysSinceOnsetOfSymptoms;

    public int getReportTypeValue() {
        return reportType.getValue();
    }
}
