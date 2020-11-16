package pl.gov.mc.protegosafe.efgs;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.http.BatchesResponse;
import pl.gov.mc.protegosafe.efgs.http.HttpConnector;
import pl.gov.mc.protegosafe.efgs.repository.BatchTagRepository;
import pl.gov.mc.protegosafe.efgs.repository.FirestoreBatchTag;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

class BatchTagServiceTest {

    private BatchTagService batchTagService;

    @Mock
    private BatchTagRepository batchTagRepository;
    @Mock
    private HttpConnector httpConnector;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
        batchTagService = new BatchTagService(batchTagRepository, httpConnector);
    }


    @Test
    void shouldFetchNextBatchTagWithEmptyValue() {

    	// given
        LocalDate date = LocalDate.parse("2020-10-01");
        FirestoreBatchTag firestoreBatchTag = mock(FirestoreBatchTag.class);
        given(batchTagRepository.fetchLastProcessedBatchTag(date)).willReturn(firestoreBatchTag);
        given(firestoreBatchTag.isProcessed()).willReturn(true);

        // when
        BatchTag batchTag = batchTagService.fetchNextBatchTag(date);

        // then
        assertThat(batchTag.isEmpty()).isEqualTo(true);
        verify(batchTagRepository, times(1)).fetchLastProcessedBatchTag(date);
        verify(httpConnector, never()).fetchBatches(any(LocalDate.class), anyString());
    }

    @Test
    void shouldFetchNextBatchTagFromHttpWhenCurrentBatchTagIsNull() {

        // given
        LocalDate date = LocalDate.parse("2020-10-01");
        String batchTag = null;
        String nextBatchTag = "2020-10-01-1";
        FirestoreBatchTag firestoreBatchTag = mock(FirestoreBatchTag.class);
        BatchesResponse batchesResponse = mock(BatchesResponse.class);
        given(batchTagRepository.fetchLastProcessedBatchTag(date)).willReturn(firestoreBatchTag);
        given(httpConnector.fetchBatches(date, batchTag)).willReturn(Optional.of(batchesResponse));
        given(firestoreBatchTag.isProcessed()).willReturn(false);
        given(firestoreBatchTag.getBatchTag()).willReturn(batchTag);
        given(batchesResponse.getNextBatchTag()).willReturn(nextBatchTag);

        // when
        BatchTag fetchedBatchTag = batchTagService.fetchNextBatchTag(date);

        // then
        assertThat(fetchedBatchTag.isEmpty()).isEqualTo(false);
        verify(batchTagRepository, times(1)).fetchLastProcessedBatchTag(date);
        verify(httpConnector, times(1)).fetchBatches(date, batchTag);
    }

    @Test
    void shouldFetchNextBatchTagFromHttpWhenCurrentBatchTagIsFilled() {

        // given
        LocalDate date = LocalDate.parse("2020-10-01");
        String batchTag = "2020-10-01-1";;
        String nextBatchTag = "2020-10-01-2";
        FirestoreBatchTag firestoreBatchTag = mock(FirestoreBatchTag.class);
        BatchesResponse batchesResponse = mock(BatchesResponse.class);
        given(batchTagRepository.fetchLastProcessedBatchTag(date)).willReturn(firestoreBatchTag);
        given(httpConnector.fetchBatches(date, batchTag)).willReturn(Optional.of(batchesResponse));
        given(firestoreBatchTag.isProcessed()).willReturn(false);
        given(firestoreBatchTag.getBatchTag()).willReturn(batchTag);
        given(batchesResponse.getNextBatchTag()).willReturn(nextBatchTag);

        // when
        BatchTag fetchedBatchTag = batchTagService.fetchNextBatchTag(date);

        // then
        assertThat(fetchedBatchTag.isEmpty()).isEqualTo(false);
        verify(batchTagRepository, times(1)).fetchLastProcessedBatchTag(date);
        verify(httpConnector, times(1)).fetchBatches(date, batchTag);
    }

}