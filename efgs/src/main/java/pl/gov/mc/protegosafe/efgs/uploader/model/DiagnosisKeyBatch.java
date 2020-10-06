package pl.gov.mc.protegosafe.efgs.uploader.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DiagnosisKeyBatch {

    private Value value;

    public List<DiagnosisKey> getKeysList() {
        return value
                .getFields()
                .getData()
                .getTemporaryExposureKeys();
    }

    public boolean isInteroperabilityEnabled() {
        return value
                .getFields()
                .getIsInteroperabilityEnabled()
                .isBooleanValue();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Setter
    @Getter
    private static class Value {

        private Fields fields;
    }

    @Setter
    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Fields {

        private BooleanValue isInteroperabilityEnabled;
        private DiagnosisKeysData data;
        private StringValue id;
    }
}
