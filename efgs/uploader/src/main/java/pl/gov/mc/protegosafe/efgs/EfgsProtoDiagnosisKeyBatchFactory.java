package pl.gov.mc.protegosafe.efgs;

import com.google.protobuf.ByteString;
import eu.interop.federationgateway.model.EfgsProto;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
class EfgsProtoDiagnosisKeyBatchFactory {

    EfgsProto.DiagnosisKeyBatch create(List<DiagnosisKey> diagnosisKeys) {

        List<EfgsProto.DiagnosisKey> keys = diagnosisKeys
                .stream()
                .map(this::createEfgsProtoDiagnosisKey)
                .collect(Collectors.toUnmodifiableList());

        return EfgsProto.DiagnosisKeyBatch.newBuilder()
                .addAllKeys(keys)
                .build();
    }

    private EfgsProto.DiagnosisKey createEfgsProtoDiagnosisKey(DiagnosisKey diagnosisKey) {
        return EfgsProto.DiagnosisKey.newBuilder()
                .setRollingPeriod(diagnosisKey.getRollingPeriod())
                .setRollingStartIntervalNumber(diagnosisKey.getRollingStartIntervalNumber().intValue())
                .setTransmissionRiskLevel(diagnosisKey.getTransmissionRiskLevel())
                .setOrigin(diagnosisKey.getOrigin())
                .setReportType(EfgsProto.ReportType.forNumber(diagnosisKey.getReportType().getValue()))
                .setKeyData(ByteString.copyFrom(Base64.getDecoder().decode(diagnosisKey.getKeyData().getBytes())))
                .setDaysSinceOnsetOfSymptoms(diagnosisKey.getDaysSinceOnsetOfSymptoms())
                .addAllVisitedCountries(diagnosisKey.getVisitedCountries())
                .build();
    }
}
