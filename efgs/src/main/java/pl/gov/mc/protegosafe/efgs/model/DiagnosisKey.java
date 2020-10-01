package pl.gov.mc.protegosafe.efgs.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class DiagnosisKey {

    private final String keyData;
    private final int rollingStartIntervalNumber;
    private final int rollingPeriod;
    private final int transmissionRiskLevel;
    private final List<String> visitedCountries;
    private final String origin;
    private final ReportType reportType;
    private final int daysSinceOnsetOfSymptoms;

    public int getReportTypeValue() {
        return reportType.getValue();
    }
}
