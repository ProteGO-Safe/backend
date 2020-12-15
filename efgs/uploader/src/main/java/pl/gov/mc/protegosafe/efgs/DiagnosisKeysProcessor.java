package pl.gov.mc.protegosafe.efgs;

public interface DiagnosisKeysProcessor {
    void process();

    Boolean isApplicable(Mode mode);
}
