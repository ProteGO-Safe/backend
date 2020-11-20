package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.http.BatchesResponse;
import pl.gov.mc.protegosafe.efgs.http.HttpConnector;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.model.ProcessedBatchesFactory;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

import static pl.gov.mc.protegosafe.efgs.DownloadedKeys.EMPTY_DOWNLOADED_KEYS;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class BatchTagFetcher {

    HttpConnector httpConnector;
    ProtobufConverter protobufConverter;
    ProcessedBatchesFactory processedBatchesFactory;

    DownloadedKeys fetchBatches(LocalDate date, String batchTag) {

        return httpConnector.fetchBatches(date, batchTag)
                .map(this::processBatchesResponse)
                .orElse(EMPTY_DOWNLOADED_KEYS);

    }

    private DownloadedKeys processBatchesResponse(BatchesResponse batchesResponse) {
        @Nullable String nextBatchTag = batchesResponse.getNextBatchTag();
        String batchTag = batchesResponse.getBatchTag();

        @Nullable ByteArrayResource responseBody = batchesResponse.getResponseBody();

        if (responseBody == null) {
            return new DownloadedKeys(batchTag, nextBatchTag);
        }

        EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = createDiagnosisKeyBatch(responseBody);

        String diagnosisKeyBatchAsString = protobufConverter.printToString(diagnosisKeyBatch);

        List<Key> keys = processedBatchesFactory.create(diagnosisKeyBatchAsString);

        return new DownloadedKeys(keys, batchTag, nextBatchTag);
    }

    @SneakyThrows
    private EfgsProto.DiagnosisKeyBatch createDiagnosisKeyBatch(ByteArrayResource responseBody) {
        return EfgsProto.DiagnosisKeyBatch.parseFrom(responseBody.getByteArray());
    }
}
