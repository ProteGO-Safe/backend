package pl.gov.mc.protegosafe.efgs;

import com.google.cloud.Tuple;
import com.google.common.collect.Sets;
import com.google.protobuf.ByteString;
import eu.interop.federationgateway.model.EfgsProto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.google.cloud.Tuple.of;

@Service
@Slf4j
class EfgsProtoDiagnosisKeyBatchFactory {

    BatchSignatureUtils batchSignatureUtils;

    public EfgsProtoDiagnosisKeyBatchFactory(BatchSignatureUtils batchSignatureUtils) {
        this.batchSignatureUtils = batchSignatureUtils;
    }

    public EfgsProto.DiagnosisKeyBatch create(List<DiagnosisKey> diagnosisKeys) {
        List<EfgsProto.DiagnosisKey> keys = diagnosisKeys
                .stream()
                .map(this::createEfgsProtoDiagnosisKey)
                .map(this::keyByHash)
                .filter(distinctBy(Tuple::x))
                .map(Tuple::y)
                .collect(Collectors.toUnmodifiableList());

        if (diagnosisKeys.size() != keys.size()) {
            log.warn("Duplicated keys!");
        }

        return EfgsProto.DiagnosisKeyBatch.newBuilder()
                .addAllKeys(keys)
                .build();
    }

    @SneakyThrows
    private Tuple<String, EfgsProto.DiagnosisKey> keyByHash(EfgsProto.DiagnosisKey diagnosisKey) {
        byte[] hash = MessageDigest.getInstance("SHA-256").digest(
                batchSignatureUtils.generateBytesToVerify(diagnosisKey)
        );

        return of(new BigInteger(1, hash).toString(16), diagnosisKey);
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

    private static <T> Predicate<T> distinctBy(Function<? super T, ?> f) {
        Set<Object> objects = Sets.newConcurrentHashSet();

        return t -> objects.add(f.apply(t));
    }
}
