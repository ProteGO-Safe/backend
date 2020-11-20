package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    ProcessedBatchesFactory processedBatchesFactory;

    DownloadedKeys fetchBatches(LocalDate date, String batchTag) {

        return httpConnector.fetchBatches(date, batchTag)
                .map(this::processBatchesResponse)
                .orElse(EMPTY_DOWNLOADED_KEYS);

    }

    private DownloadedKeys processBatchesResponse(BatchesResponse batchesResponse) {
        @Nullable String nextBatchTag = batchesResponse.getNextBatchTag();
        String batchTag = batchesResponse.getBatchTag();

        @Nullable String responseBody = batchesResponse.getResponseBody();

        if (responseBody == null) {
            return new DownloadedKeys(batchTag, nextBatchTag);
        }

        List<Key> keys = processedBatchesFactory.create(responseBody);

        return new DownloadedKeys(keys, batchTag, nextBatchTag);
    }
}
