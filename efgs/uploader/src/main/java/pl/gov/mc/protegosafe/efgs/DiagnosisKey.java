package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;
import lombok.Getter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Random;

import static org.apache.commons.lang3.RandomUtils.nextInt;
import static org.apache.commons.lang3.RandomUtils.nextLong;

@Getter
public class DiagnosisKey {

    private static final List<String> VISITED_COUNTRIES = Lists.newArrayList("BE","GR","LT","PT","BG","ES","LU","RO","CZ","FR","HU","SI","DK","HR","MT","SK","DE","IT","NL","FI","EE","CY","AT","SE","IE","LV","IS","NO","LI","CH");
    private static final Integer DAYS_SINCE_ONSET_OF_SYMPTOMS = 4000;
    private static final String ORIGIN = "PL";
    private static final int ROLLING_START_INTERVAL_LENGTH = 600;
    private static final int MAX_ROLLING_PERIOD = 144;
    private static final int MAX_RISK_LEVEL = 8;

    private final String keyData;
    private final Long rollingStartIntervalNumber;
    private final Integer rollingPeriod;
    private final Integer transmissionRiskLevel;
    private final List<String> visitedCountries;
    private final String origin;
    private final ReportType reportType;
    private final Integer daysSinceOnsetOfSymptoms;

    private DiagnosisKey(String keyData,
                         Long rollingStartIntervalNumber,
                         Integer rollingPeriod,
                         Integer transmissionRiskLevel,
                         List<String> visitedCountries,
                         String origin,
                         ReportType reportType,
                         Integer daysSinceOnsetOfSymptoms) {
        this.keyData = keyData;
        this.rollingStartIntervalNumber = rollingStartIntervalNumber;
        this.rollingPeriod = rollingPeriod;
        this.transmissionRiskLevel = transmissionRiskLevel;
        this.visitedCountries = visitedCountries;
        this.origin = origin;
        this.reportType = reportType;
        this.daysSinceOnsetOfSymptoms = daysSinceOnsetOfSymptoms;
    }

    public DiagnosisKey(String keyData,
                         Long rollingStartIntervalNumber,
                         Integer rollingPeriod,
                         Integer transmissionRiskLevel) {
        this(keyData, rollingStartIntervalNumber, rollingPeriod, transmissionRiskLevel,
                VISITED_COUNTRIES, ORIGIN, ReportType.CONFIRMED_CLINICAL_DIAGNOSIS, DAYS_SINCE_ONSET_OF_SYMPTOMS);
    }

    static DiagnosisKey random() {

        long minimumRollingStart = Instant
                .now()
                .truncatedTo(ChronoUnit.DAYS)
                .minus(15, ChronoUnit.DAYS)
                .getEpochSecond() / ROLLING_START_INTERVAL_LENGTH;

        long maximumRollingStart = Instant
                .now()
                .getEpochSecond() / ROLLING_START_INTERVAL_LENGTH;
        maximumRollingStart += 1;

        return new DiagnosisKey(
                generateRandomKey(),
                nextLong(minimumRollingStart, maximumRollingStart),
                nextInt(1, MAX_ROLLING_PERIOD),
                nextInt(1, MAX_RISK_LEVEL),
                VISITED_COUNTRIES,
                ORIGIN,
                ReportType.obtainRandom(),
                DiagnosisKey.DAYS_SINCE_ONSET_OF_SYMPTOMS
        );

    }

    private static String generateRandomKey() {
        byte[] bytes = new byte[16];
        new Random().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
