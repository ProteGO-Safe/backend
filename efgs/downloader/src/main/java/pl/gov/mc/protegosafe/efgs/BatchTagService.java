package pl.gov.mc.protegosafe.efgs;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.http.BatchesResponse;
import pl.gov.mc.protegosafe.efgs.http.HttpConnector;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;
import pl.gov.mc.protegosafe.efgs.repository.FirestoreBatchTag;

import java.time.LocalDate;

import static pl.gov.mc.protegosafe.efgs.BatchTag.EMPTY;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class BatchTagService {

    BatchTagRepository batchTagRepository;
    HttpConnector httpConnector;


    BatchTag fetchNextBatchTag(LocalDate date) {

        FirestoreBatchTag firestoreBatchTag = batchTagRepository.fetchLastProcessedBatchTag(date);

        if (firestoreBatchTag.isProcessed()) {
            return EMPTY;
        }

        return fetchNextBatchTag(date, firestoreBatchTag);
    }

    private BatchTag fetchNextBatchTag(LocalDate date, FirestoreBatchTag firestoreBatchTag) {

        String batchTag = firestoreBatchTag.getBatchTag();

        return httpConnector.fetchBatches(date, batchTag)
                .map(batchesResponse -> createBatchTag(batchesResponse, batchTag))
                .orElse(EMPTY);
    }

    private BatchTag createBatchTag(BatchesResponse batchesResponse, String batchTag) {
        if (batchTag == null) {
            return new BatchTag(batchesResponse.getBatchTag());
        }
        return new BatchTag(batchesResponse.getNextBatchTag());
    }
}
