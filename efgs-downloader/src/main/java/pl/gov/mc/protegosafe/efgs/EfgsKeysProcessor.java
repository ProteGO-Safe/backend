package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;


@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class EfgsKeysProcessor {

    DownloaderService downloaderService;
    ProcessedDateService processedDateService;
    BatchTagService batchTagService;


    void process() {
        LocalDate date = processedDateService.fetchDateToProcess();
        BatchTag batchTag = batchTagService.fetchNextBatchTag(date);
        if (batchTag.isEmpty()) {
            return;
        }
        downloaderService.process(date, batchTag.getBatchTag(), batchTag.getOffset());
        processedDateService.markDateAsProcessed(date);
    }
}
