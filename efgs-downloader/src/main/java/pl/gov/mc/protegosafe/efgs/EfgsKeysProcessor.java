package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;


@Slf4j
@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class EfgsKeysProcessor {

    DownloaderService downloaderService;
    ProcessedDateService processedDateService;
    BatchTagService batchTagService;


    void process() {
        LocalDate date = processedDateService.fetchDateToProcess();
        log.info("Started downloading for date: {}", date);
        BatchTag batchTag = batchTagService.fetchNextBatchTag(date);
        if (batchTag.isEmpty()) {
            log.info("No next batch tag for date: {}", date);
            return;
        }
        downloaderService.process(date, batchTag.getBatchTag(), batchTag.getOffset());
        processedDateService.markDateAsProcessed(date);
    }
}
