package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.ImmutableList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.message.MessageSender;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static pl.gov.mc.protegosafe.efgs.DownloadedKeys.EMPTY_DOWNLOADED_KEYS;

class DownloaderServiceTest {

    private DownloaderService downloaderService;

    @Mock
    private BatchTagFetcher batchTagFetcher;
    @Mock
    private MessageSender messageSender;
    @Mock
    private BatchTagRepository batchTagRepository;
    @Mock
    private DownloadedKeysFilter downloadedKeysFilter;;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
        downloaderService = new DownloaderService(batchTagFetcher, messageSender, batchTagRepository, downloadedKeysFilter);
    }

    @Test
    void shouldProcessWhenNoBatchTagAndNoDownloadedData() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        int offset = 0;
        DownloadedKeys downloadedKeys = new DownloadedKeys(ImmutableList.of(), null,null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, never()).sendMessage(any(), any());
        verify(batchTagRepository, never()).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldProcessWhenNoBatchTagAndDownloadedOneKey() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        int offset = 0;
        List<Key> keys = generateMockedKeys(1);
        DownloadedKeys downloadedKeys = new DownloadedKeys(keys, batchTagFromEfgs, null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);
        given(downloadedKeysFilter.filter(keys)).willReturn(keys);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, times(1)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 30);
    }

    @Test
    void shouldProcessWhenNoBatchTagAndDownloaded100Key() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        int offset = 0;
        List<Key> keys = generateMockedKeys(100);
        DownloadedKeys downloadedKeys = new DownloadedKeys(keys, batchTagFromEfgs, null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);
        given(downloadedKeysFilter.filter(keys)).willReturn(keys);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, times(4)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 60);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 120);
        verify(batchTagRepository, times(4)).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldProcessWhenNoBatchTagAndDownloaded100KeyWithException() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        int offset = 0;
        List<Key> keys = generateMockedKeys(100);
        DownloadedKeys downloadedKeys = new DownloadedKeys(keys, batchTagFromEfgs, null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);
        given(downloadedKeysFilter.filter(keys)).willReturn(keys);

        doThrow(IllegalArgumentException.class)
                .when(batchTagRepository)
                .saveBatchTag(date, batchTagFromEfgs, 60);

        // when
        try {
            downloaderService.process(date, batchTag, offset);
        } catch (IllegalArgumentException e) {
            // do nothing
        }

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, times(2)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 60);
        verify(batchTagRepository, times(2)).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldProcessWhenNoBatchTagAndOffset60AndDownloaded100Key() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        int offset = 60;
        List<Key> keys = generateMockedKeys(100);
        DownloadedKeys downloadedKeys = new DownloadedKeys(keys, batchTagFromEfgs, null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);
        given(downloadedKeysFilter.filter(keys)).willReturn(keys);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, times(2)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 120);
        verify(batchTagRepository, times(2)).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldProcessWhenNoBatchTagNextBatchTagExistsAndDownloadedSeveralKey() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        String nextBatchTagFromEfgs = "2020-11-01-2";
        int offset = 0;
        List<Key> keysForFirstDownload = generateMockedKeys(100);
        DownloadedKeys downloadedKeysFirstTime = new DownloadedKeys(keysForFirstDownload, batchTagFromEfgs, nextBatchTagFromEfgs);
        List<Key> keysForSecondDownload = generateMockedKeys(143);
        DownloadedKeys downloadedKeysSecondTime = new DownloadedKeys(keysForSecondDownload, nextBatchTagFromEfgs, null);

        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeysFirstTime);
        given(batchTagFetcher.fetchBatches(date, nextBatchTagFromEfgs)).willReturn(downloadedKeysSecondTime);
        given(downloadedKeysFilter.filter(keysForFirstDownload)).willReturn(keysForFirstDownload);
        given(downloadedKeysFilter.filter(keysForSecondDownload)).willReturn(keysForSecondDownload);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(date, nextBatchTagFromEfgs);
        verify(batchTagFetcher, times(2)).fetchBatches(any(), any());
        verify(messageSender, times(9)).sendMessage(any(), any());
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 60);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 120);
        verify(messageSender, times(4)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagFromEfgs, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagFromEfgs, 60);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagFromEfgs, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagFromEfgs, 120);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagFromEfgs, 150);
        verify(messageSender, times(5)).sendMessage(any(), eq(nextBatchTagFromEfgs));
        verify(batchTagRepository, times(9)).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldProcessThreeTimes() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = "2020-11-01-2";
        String batchTagForFirstDownload = batchTag;
        String nextBatchTagForFirstDownload = "2020-11-01-3";
        String nextBatchTagForSecondDownload = "2020-11-01-4";

        int offset = 0;
        List<Key> keysForFirstDownload = generateMockedKeys(100);
        DownloadedKeys downloadedKeysFirstTime = new DownloadedKeys(keysForFirstDownload, batchTagForFirstDownload, nextBatchTagForFirstDownload);
        List<Key> keysForSecondDownload = generateMockedKeys(143);
        DownloadedKeys downloadedKeysSecondTime = new DownloadedKeys(keysForSecondDownload, nextBatchTagForFirstDownload, nextBatchTagForSecondDownload);
        List<Key> keysForThirdDownload = generateMockedKeys(4);
        DownloadedKeys downloadedKeysThirdTime = new DownloadedKeys(keysForThirdDownload, nextBatchTagForSecondDownload, null);


        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeysFirstTime);
        given(batchTagFetcher.fetchBatches(date, nextBatchTagForFirstDownload)).willReturn(downloadedKeysSecondTime);
        given(batchTagFetcher.fetchBatches(date, nextBatchTagForSecondDownload)).willReturn(downloadedKeysThirdTime);
        given(downloadedKeysFilter.filter(keysForFirstDownload)).willReturn(keysForFirstDownload);
        given(downloadedKeysFilter.filter(keysForSecondDownload)).willReturn(keysForSecondDownload);
        given(downloadedKeysFilter.filter(keysForThirdDownload)).willReturn(keysForThirdDownload);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(date, nextBatchTagForFirstDownload);
        verify(batchTagFetcher, times(1)).fetchBatches(date, nextBatchTagForSecondDownload);
        verify(batchTagFetcher, times(3)).fetchBatches(any(), any());
        verify(messageSender, times(10)).sendMessage(any(), any());
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagForFirstDownload, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagForFirstDownload, 60);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagForFirstDownload, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagForFirstDownload, 120);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForFirstDownload, 30);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForFirstDownload, 60);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForFirstDownload, 90);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForFirstDownload, 120);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForFirstDownload, 150);
        verify(batchTagRepository, times(1)).saveBatchTag(date, nextBatchTagForSecondDownload, 30);
        verify(batchTagRepository, times(10)).saveBatchTag(any(), any(), anyInt());
    }

    @Test
    void shouldNotProcessWhenDownloadedKeysAreEmpty() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = "2020-11-01-2";

        int offset = 0;
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(EMPTY_DOWNLOADED_KEYS);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, never()).sendMessage(any(), any());
    }

    @Test
    void shouldProcessWhenFilteredDownloadedKeys() {

        // given
        LocalDate date = LocalDate.parse("2020-11-01");
        String batchTag = null;
        String batchTagFromEfgs = "2020-11-01-1";
        int offset = 0;
        List<Key> keys = generateMockedKeys(100);
        List<Key> filteredKeys = generateMockedKeys(10);
        DownloadedKeys downloadedKeys = new DownloadedKeys(keys, batchTagFromEfgs, null);
        given(batchTagFetcher.fetchBatches(date, batchTag)).willReturn(downloadedKeys);
        given(downloadedKeysFilter.filter(keys)).willReturn(filteredKeys);

        // when
        downloaderService.process(date, batchTag, offset);

        // then
        verify(batchTagFetcher, times(1)).fetchBatches(date, batchTag);
        verify(batchTagFetcher, times(1)).fetchBatches(any(), any());
        verify(messageSender, times(1)).sendMessage(any(), eq(batchTagFromEfgs));
        verify(batchTagRepository, times(1)).saveBatchTag(date, batchTagFromEfgs, 30);
    }

    private List<Key> generateMockedKeys(int amount) {
        return IntStream.range(0, amount)
                .mapToObj(value -> mock(Key.class))
                .collect(Collectors.toUnmodifiableList());
    }

}