package pl.gov.mc.protegosafe.efgs;

import com.google.protobuf.ByteString;
import eu.interop.federationgateway.model.EfgsProto;
import pl.gov.mc.protegosafe.efgs.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.model.DiagnosisKeyBatch;

import java.util.List;
import java.util.stream.Collectors;

class EfgsProtoDiagnosisKeyBatchFatory {

    static EfgsProto.DiagnosisKeyBatch create(DiagnosisKeyBatch diagnosisKeyBatch) {

        List<EfgsProto.DiagnosisKey> keys = diagnosisKeyBatch.getKeysList()
                .stream()
                .map(EfgsProtoDiagnosisKeyBatchFatory::createEfgsProtoDiagnosisKey)
                .collect(Collectors.toUnmodifiableList());

        return EfgsProto.DiagnosisKeyBatch.newBuilder()
                .addAllKeys(keys)
                .build();

    }

    private static EfgsProto.DiagnosisKey createEfgsProtoDiagnosisKey(DiagnosisKey diagnosisKey) {
        return EfgsProto.DiagnosisKey.newBuilder()
                .setRollingPeriod(diagnosisKey.getRollingPeriod())
                .setRollingStartIntervalNumber(diagnosisKey.getRollingStartIntervalNumber())
                .setTransmissionRiskLevel(diagnosisKey.getTransmissionRiskLevel())
                .setOrigin(diagnosisKey.getOrigin())
                .setReportType(EfgsProto.ReportType.CONFIRMED_CLINICAL_DIAGNOSIS)
                .setKeyData(ByteString.copyFrom(diagnosisKey.getKeyData().getBytes()))
                .setDaysSinceOnsetOfSymptoms(diagnosisKey.getDaysSinceOnsetOfSymptoms())
                .addAllVisitedCountries(diagnosisKey.getVisitedCountries())
                .build();
    }
}
