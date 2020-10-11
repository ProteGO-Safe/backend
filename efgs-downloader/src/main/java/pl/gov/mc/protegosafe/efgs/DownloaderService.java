package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.http.AuditResponse;
import pl.gov.mc.protegosafe.efgs.http.BatchesResponse;
import pl.gov.mc.protegosafe.efgs.http.HttpConnector;
import pl.gov.mc.protegosafe.efgs.validator.Validator;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.util.Assert.isTrue;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloaderService {

    HttpConnector httpConnector;
    ProtobufConverter protobufConverter;
    Validator validator;

    void process(
            List<ProcessedBatches> responses,
            LocalDate date,
            String batchTag) {

        BatchesResponse response = httpConnector.fetchBatches(date, batchTag);

        isTrue(batchTag.equals(response.getBatchTag()), "received batchTag has to be the same");

        @Nullable String nextBatchTag = response.getNextBatchTag();
        @Nullable ByteArrayResource responseBody = response.getResponseBody();

        if (responseBody == null && nextBatchTag == null) {
            return;
        }

        if (responseBody == null) {
            process(responses, date, nextBatchTag);
            return;
        }

        List<AuditResponse> auditResponses = httpConnector.listAudits(batchTag, date);

        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);

        if (validator.validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditResponses)) {
            String diagnosisKeyBatchAsString = protobufConverter.printToString(diagnosisKeyBatch);
            responses.add(new ProcessedBatches(batchTag, diagnosisKeyBatchAsString));
        }

        if (nextBatchTag != null) {
            process(responses, date, nextBatchTag);
        }
    }

    @SneakyThrows
    private EfgsProto.DiagnosisKeyBatch createDiagnosisKeyBatch(ByteArrayResource responseBody) {
        return EfgsProto.DiagnosisKeyBatch.parseFrom(responseBody.getByteArray());
    }
}
