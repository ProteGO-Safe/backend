package pl.gov.mc.protegosafe.efgs.model;

import com.google.common.collect.Lists;
import lombok.Getter;
import lombok.Setter;

@Setter
class Tek {

    private MapValue mapValue;

    DiagnosisKey getDiagnosisKey() {
        Fields fields = mapValue.getFields();

        return new DiagnosisKey(
                fields.getKey().getStringValue(),
                fields.getRollingStartNumber().getIntegerValue(),
                fields.getRollingPeriod().getIntegerValue(),
                fields.getTransmissionRisk().getIntegerValue(),
                Lists.newArrayList("DE"),
                "pl",
                ReportType.CONFIRMED_CLINICAL_DIAGNOSIS,
                42
                );
    }

    @Setter
    @Getter
    private static class MapValue {

        private Fields fields;
    }

    @Setter
    @Getter
    private static class Fields {

        private StringValue key;
        private IntegerValue rollingPeriod;
        private IntegerValue rollingStartNumber;
        private IntegerValue transmissionRisk;
    }

}
