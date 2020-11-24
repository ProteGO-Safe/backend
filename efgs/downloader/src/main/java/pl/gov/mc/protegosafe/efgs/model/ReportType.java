package pl.gov.mc.protegosafe.efgs.model;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum ReportType {

    UNKNOWN(0),
    CONFIRMED_TEST(1),
    CONFIRMED_CLINICAL_DIAGNOSIS(2),
    SELF_REPORT(3),
    RECURSIVE(4),
    REVOKED(5);

    private final int value;
}
