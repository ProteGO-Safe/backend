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
import pl.gov.mc.protegosafe.efgs.message.MessageSender;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.model.ProcessedBatches;
import pl.gov.mc.protegosafe.efgs.model.ProcessedBatchesFactory;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;
import pl.gov.mc.protegosafe.efgs.utils.Partition;
import pl.gov.mc.protegosafe.efgs.validator.BatchSignatureVerifier;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;
import static org.springframework.util.Assert.isTrue;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloaderService {

    HttpConnector httpConnector;
    ProtobufConverter protobufConverter;
    BatchSignatureVerifier batchSignatureVerifier;
    ProcessedBatchesFactory processedBatchesFactory;
    MessageSender messageSender;
    BatchTagRepository batchTagRepository;

    void process(LocalDate date, String batchTag, int offset) {
        BatchesResponse response = httpConnector.fetchBatches(date, batchTag);
        @Nullable String nextBatchTag = response.getNextBatchTag();

        if (batchTag == null && nextBatchTag != null) {
            process(date, nextBatchTag, 0);
            return;
        }

        ByteArrayResource responseBody = response.getResponseBody();
        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);
        List<AuditResponse> auditResponses = httpConnector.listAudits(batchTag, date);
        if (!batchSignatureVerifier.validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditResponses)) {
            throw new IllegalArgumentException("No valid keys.");
        }

        String diagnosisKeyBatchAsString = protobufConverter.printToString(diagnosisKeyBatch);
        ProcessedBatches processedBatches = processedBatchesFactory.create(batchTag, diagnosisKeyBatchAsString);

        Partition<Key> chunks = Partition.ofSize(processedBatches.getKeys(), 100);
        int index = 0;
        for (List<Key> keys : chunks) {
            index++;
            if (index * 100 <= offset) {
                continue;
            }
            messageSender.sendMessage(keys, processedBatches.getBatchTag());
            batchTagRepository.saveLastBatchTag(date, processedBatches.getBatchTag(), index * 100);
        }

        if (nextBatchTag == null) {
            return;
        }

        process(date, nextBatchTag, 0);
    }

    @SneakyThrows
    private EfgsProto.DiagnosisKeyBatch createDiagnosisKeyBatch(ByteArrayResource responseBody) {
        return EfgsProto.DiagnosisKeyBatch.parseFrom(responseBody.getByteArray());
    }
}
