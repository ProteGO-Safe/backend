package pl.gov.mc.protegosafe.efgs.model;

public enum ReportType {

    UNKNOWN(0),
    CONFIRMED_TEST(1),
    CONFIRMED_CLINICAL_DIAGNOSIS(2),
    SELF_REPORT(3),
    RECURSIVE(4),
    REVOKED(5);

    private final int value;

    ReportType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
