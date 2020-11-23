package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.message.MessageSender;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
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
    DownloadedKeysFilter downloadedKeysFilter;
    DownloadedKeysMapper downloadedKeysMapper;

    void process(LocalDate date, String batchTag, int offset) {

        log.info("started processing download, date: {}, batchTag: {}, offset: {}", date, batchTag, offset);

        DownloadedKeys downloadedKeys = batchTagFetcher.fetchBatches(date, batchTag);

        log.info("downloaded keys: {}, batch tag: {}, next batch tag: {}", downloadedKeys.getKeys().size(), downloadedKeys.getBatchTag(), downloadedKeys.getNextBatchTag());

        String downloadedBatchTag = downloadedKeys.getBatchTag();
        @Nullable String nextBatchTag = downloadedKeys.getNextBatchTag();

        if (downloadedBatchTag == null && nextBatchTag == null) {
            return;
        }

        List<Key> keys = prepareKeys(downloadedKeys.getKeys());

        KeyChunker keyChunker = KeyChunker.of(keys, MAX_GENS_SIZE);

        log.info("started processing chunks of keys, size: {}, keys: {}", keyChunker.size(), keyChunker.amountOfKeys());

        IntStream.range(0, keyChunker.size())
            .skip(offset / MAX_GENS_SIZE)
            .forEach(index -> {
                messageSender.sendMessage(keyChunker.get(index), downloadedBatchTag);
                batchTagRepository.saveBatchTag(date, downloadedBatchTag, ++index * MAX_GENS_SIZE);
            });

        if (nextBatchTag == null) {
            return;
        }

        process(date, nextBatchTag, 0);
    }

    private List<Key> prepareKeys(List<Key> keys) {
        return keys.stream()
                .filter(downloadedKeysFilter::filter)
                .map(downloadedKeysMapper::map)
                .collect(Collectors.toUnmodifiableList());
    }
}
