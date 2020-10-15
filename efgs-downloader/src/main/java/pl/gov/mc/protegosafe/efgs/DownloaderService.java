package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
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
import pl.gov.mc.protegosafe.efgs.validator.BatchSignatureVerifier;

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
    BatchSignatureVerifier batchSignatureVerifier;

    List<ProcessedBatches> process(LocalDate date,
            String batchTag) {

        return process(date, batchTag, null);
    }

    private List<ProcessedBatches> process(LocalDate date, String batchTag, @Nullable List<ProcessedBatches> responses) {

        List<ProcessedBatches> mutableResponses = createOrCopyResponses(responses);

        if (batchTag == null) {
            return ImmutableList.copyOf(mutableResponses);
        }


        BatchesResponse response = httpConnector.fetchBatches(date, batchTag);

        isTrue(batchTag.equals(response.getBatchTag()), "received batchTag has to be the same");

        @Nullable String nextBatchTag = response.getNextBatchTag();
        ByteArrayResource responseBody = response.getResponseBody();

        List<AuditResponse> auditResponses = httpConnector.listAudits(batchTag, date);

        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);

        if (batchSignatureVerifier.validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditResponses)) {
            String diagnosisKeyBatchAsString = protobufConverter.printToString(diagnosisKeyBatch);
            mutableResponses.add(new ProcessedBatches(batchTag, diagnosisKeyBatchAsString));
        }

        return process(date, nextBatchTag, ImmutableList.copyOf(mutableResponses));
    }

    private List<ProcessedBatches> createOrCopyResponses(List<ProcessedBatches> responses) {
        return responses == null ? Lists.newArrayList() : Lists.newArrayList(responses);
    }

    @SneakyThrows
    private EfgsProto.DiagnosisKeyBatch createDiagnosisKeyBatch(ByteArrayResource responseBody) {
        return EfgsProto.DiagnosisKeyBatch.parseFrom(responseBody.getByteArray());
    }
}
