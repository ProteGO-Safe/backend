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
            return fetchNextBatchTag(date, firestoreBatchTag);
        }

        return new BatchTag(firestoreBatchTag.getBatchTag(), firestoreBatchTag.getSentKeys());
    }

    private BatchTag fetchNextBatchTag(LocalDate date, FirestoreBatchTag firestoreBatchTag) {

        return httpConnector.fetchBatches(date, firestoreBatchTag.getBatchTag())
                .map(this::createBatchTag)
                .orElse(EMPTY);
    }

    private BatchTag createBatchTag(BatchesResponse batchesResponse) {
        return new BatchTag(batchesResponse.getBatchTag());
    }
}
