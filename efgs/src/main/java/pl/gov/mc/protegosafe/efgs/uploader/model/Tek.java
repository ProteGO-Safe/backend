package pl.gov.mc.protegosafe.efgs.uploader.model;

import lombok.Getter;
import lombok.Setter;

import static pl.gov.mc.protegosafe.efgs.Constants.*;

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
                TEK_VISITED_COUNTRIES,
                TEK_ORIGIN,
                ReportType.CONFIRMED_CLINICAL_DIAGNOSIS,
                TEK_DAYS_SINCE_ONSET_OF_SYMPTOMS
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
