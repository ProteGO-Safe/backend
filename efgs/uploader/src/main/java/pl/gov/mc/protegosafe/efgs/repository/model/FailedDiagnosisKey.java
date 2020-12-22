package pl.gov.mc.protegosafe.efgs.repository.model;

import lombok.Getter;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static java.time.LocalDateTime.now;

@Getter
public class FailedDiagnosisKey extends DiagnosisKey {

    private final String id;
    private final Long createdAt;
    private final Long updatedAt;
    private final Integer numberOfRetries;

    private FailedDiagnosisKey(
            String id,
            String keyData,
            Long rollingStartIntervalNumber,
            Integer rollingPeriod,
            Integer transmissionRiskLevel,
            List<String> visitedCountries,
            String origin,
            ReportType reportType,
            Integer daysSinceOnsetOfSymptoms,
            Long createdAt,
            Long updatedAt,
            Integer numberOfRetries) {
        super(keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel, visitedCountries, origin, reportType, daysSinceOnsetOfSymptoms);
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.numberOfRetries = numberOfRetries;
    }

    private FailedDiagnosisKey(
            String id,
            String keyData,
            Long rollingStartIntervalNumber,
            Integer rollingPeriod,
            Integer transmissionRiskLevel,
            Long createdAt,
            Long updatedAt,
            Integer numberOfRetries) {
        super(keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel);
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.numberOfRetries = numberOfRetries;
    }

    public static FailedDiagnosisKey fromMap(Map<String, Object> diagnosisKey) {
        return new FailedDiagnosisKey(
                (String) diagnosisKey.get("id"),
                (String) diagnosisKey.get("keyData"),
                (Long) diagnosisKey.get("rollingStartIntervalNumber"),
                ((Long) diagnosisKey.get("rollingPeriod")).intValue(),
                ((Long) diagnosisKey.get("transmissionRiskLevel")).intValue(),
                (List<String>) diagnosisKey.get("visitedCountries"),
                (String) diagnosisKey.get("origin"),
                ReportType.valueOf(diagnosisKey.get("reportType").toString()),
                ((Long) diagnosisKey.get("daysSinceOnsetOfSymptoms")).intValue(),
                (Long) diagnosisKey.get("createdAt"),
                (Long) diagnosisKey.get("updatedAt"),
                ((Long) diagnosisKey.get("numberOfRetries")).intValue()
        );
    }

    public static FailedDiagnosisKey fromDiagnosisKey(DiagnosisKey diagnosisKey) {
        return new FailedDiagnosisKey(
                UUID.randomUUID().toString(),
                diagnosisKey.getKeyData(),
                diagnosisKey.getRollingStartIntervalNumber(),
                diagnosisKey.getRollingPeriod(),
                diagnosisKey.getTransmissionRiskLevel(),
                now().toEpochSecond(ZoneOffset.UTC),
                now().toEpochSecond(ZoneOffset.UTC),
                0
        );
    }

    public static DiagnosisKey fromFailedDiagnosisKey(FailedDiagnosisKey failedDiagnosisKey) {
        return new DiagnosisKey(
                failedDiagnosisKey.getKeyData(),
                failedDiagnosisKey.getRollingStartIntervalNumber(),
                failedDiagnosisKey.getRollingPeriod(),
                failedDiagnosisKey.getTransmissionRiskLevel(),
                failedDiagnosisKey.getVisitedCountries(),
                failedDiagnosisKey.getOrigin(),
                failedDiagnosisKey.getReportType(),
                failedDiagnosisKey.getDaysSinceOnsetOfSymptoms()
        );
    }
}
