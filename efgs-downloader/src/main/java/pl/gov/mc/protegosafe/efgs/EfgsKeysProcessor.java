package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.http.HttpConnector;
import pl.gov.mc.protegosafe.efgs.message.MessageSender;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class EfgsKeysProcessor {

    HttpConnector httpConnector;
    DownloaderService downloaderService;
    MessageSender messageSender;
    BatchTagRepository batchTagRepository;

    void process(LocalDate date) {
        String lastProcessedBatchTag = batchTagRepository.fetchLastProcessedBatchTag(date);
        String nextBatchTag = httpConnector.fetchNextBatchTag(date, lastProcessedBatchTag);

        List<ProcessedBatches> processedBatches = downloaderService.process(date, nextBatchTag);

        processedBatches.stream()
                .max(ProcessedBatches::compareTo)
                .map(ProcessedBatches::getBatchTag)
                .ifPresent(lastBatchTag -> processResponses(processedBatches, date, lastBatchTag));
    }

    @SneakyThrows
    private void processResponses(List<ProcessedBatches> processedBatches, LocalDate date, String lastBatchTag) {

        messageSender.sendMessage(processedBatches);
        batchTagRepository.saveLastBatchTag(date, lastBatchTag);
    }
}
