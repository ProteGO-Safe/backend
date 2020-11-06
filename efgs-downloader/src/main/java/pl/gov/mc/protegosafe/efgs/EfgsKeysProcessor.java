package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;
import pl.gov.mc.protegosafe.efgs.repository.model.LastProcessedBatchTag;

import java.time.LocalDate;


@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class EfgsKeysProcessor {

    DownloaderService downloaderService;
    BatchTagRepository batchTagRepository;
    ProcessedDateService processedDateService;

    void process() {
        LocalDate date = processedDateService.fetchDateToProcess();
        LastProcessedBatchTag lastProcessedBatchTag = batchTagRepository.fetchLastProcessedBatchTag(date);
        downloaderService.process(date, lastProcessedBatchTag.getBatchTag(), lastProcessedBatchTag.getOffset());
        processedDateService.markDateAsProcessed(date);
    }
}
