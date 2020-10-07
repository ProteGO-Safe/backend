package pl.gov.mc.protegosafe.efgs.downloader;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.SneakyThrows;
import org.springframework.core.io.ByteArrayResource;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.util.Assert.isTrue;
import static pl.gov.mc.protegosafe.efgs.downloader.HttpDownloader.validateDiagnosisKeyWithSignature;

class DownloaderService {

    static void process(
            List<ProcessedDownloadedDiagnosisKeyBatches> responses,
            LocalDate date,
            String batchTag) {

        DownloadedDiagnosisKeyBatchesResponse response = HttpDownloader.downloadDiagnosisKeyBatches(date, batchTag);

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

        List<AuditEntry> auditEntries = HttpDownloader.callAuditDownload(batchTag, date);

        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);

        if (validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditEntries)) {
            String diagnosisKeyBatchAsString = ProtobufConverter.getInstance().printToString(diagnosisKeyBatch);
            responses.add(new ProcessedDownloadedDiagnosisKeyBatches(batchTag, diagnosisKeyBatchAsString));
        }

        if (nextBatchTag != null) {
            process(responses, date, nextBatchTag);
        }
    }

    @SneakyThrows
    private static EfgsProto.DiagnosisKeyBatch createDiagnosisKeyBatch(ByteArrayResource responseBody) {
        return EfgsProto.DiagnosisKeyBatch.parseFrom(responseBody.getByteArray());
    }
}
