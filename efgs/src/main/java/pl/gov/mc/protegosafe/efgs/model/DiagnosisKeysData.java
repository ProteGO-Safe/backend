package pl.gov.mc.protegosafe.efgs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Setter
class DiagnosisKeysData {

    private MapValue mapValue;

    public List<DiagnosisKey> getTemporaryExposureKeys() {
        return mapValue
                .getFields()
                .getTemporaryExposureKeys()
                .getArrayValue()
                .stream()
                .map(Tek::getDiagnosisKey)
                .collect(Collectors.toUnmodifiableList());
    }

    @Getter
    @Setter
    private static class MapValue {

        private Fields fields;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Fields {

        private StringValue appPackageName;
        private StringValue platform;
        private Array<StringValue> regions;
        private Array<Tek> temporaryExposureKeys;
    }
}
