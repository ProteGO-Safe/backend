package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.message.MessageSender;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;
import pl.gov.mc.protegosafe.efgs.utils.Partition;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.stream.IntStream;

@Slf4j
@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloaderService {

    // 30 is max size accepted by gens
    private static final int MAX_GENS_SIZE = 30;

    BatchTagFetcher batchTagFetcher;
    MessageSender messageSender;
    BatchTagRepository batchTagRepository;

    void process(LocalDate date, String batchTag, int offset) {

        log.info("started processing download, date: {}, batchTag: {}, offset: {}", date, batchTag, offset);

        DownloadedKeys downloadedKeys = batchTagFetcher.fetchBatches(date, batchTag);
        String downloadedBatchTag = downloadedKeys.getBatchTag();
        @Nullable String nextBatchTag = downloadedKeys.getNextBatchTag();

        if (downloadedBatchTag == null && nextBatchTag == null) {
            return;
        }

        Partition<Key> partitions = Partition.ofSize(downloadedKeys.getKeys(), MAX_GENS_SIZE);

        IntStream.range(0, partitions.size())
            .skip(offset / MAX_GENS_SIZE)
            .forEach(index -> {
                messageSender.sendMessage(partitions.get(index));
                batchTagRepository.saveBatchTag(date, downloadedBatchTag, ++index * MAX_GENS_SIZE);
            });

        if (nextBatchTag == null) {
            return;
        }

        process(date, nextBatchTag, 0);
    }
}
