package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.util.Assert.isTrue;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloaderService {

    HttpDownloader httpDownloader;
    ProtobufConverter protobufConverter;

    void process(
            List<ProcessedDownloadedDiagnosisKeyBatches> responses,
            LocalDate date,
            String batchTag) {

        DownloadedDiagnosisKeyBatchesResponse response = httpDownloader.downloadDiagnosisKeyBatches(date, batchTag);

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

        List<AuditEntry> auditEntries = httpDownloader.callAuditDownload(batchTag, date);

        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);

        if (httpDownloader.validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditEntries)) {
            String diagnosisKeyBatchAsString = protobufConverter.printToString(diagnosisKeyBatch);
            responses.add(new ProcessedDownloadedDiagnosisKeyBatches(batchTag, diagnosisKeyBatchAsString));
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
