package pl.gov.mc.protegosafe.efgs;

import lombok.AllArgsConstructor;

import java.util.Arrays;

@AllArgsConstructor
public enum ReportType {

    UNKNOWN(0),
    CONFIRMED_TEST(1),
    CONFIRMED_CLINICAL_DIAGNOSIS(2),
    SELF_REPORT(3),
    RECURSIVE(4),
    REVOKED(5);

    private final int value;

    public static ReportType fromInt(Integer value) {
        return Arrays.stream(ReportType.values())
                .filter(reportType -> reportType.getValue() == value)
                .findAny()
                .orElseThrow(IllegalArgumentException::new);
    }

    public int getValue() {
        return value;
    }
}
