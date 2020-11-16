package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.repository.ProcessedDateRepository;
import pl.gov.mc.protegosafe.efgs.repository.ProcessedDate;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

class ProcessedDateServiceTest {

    private static final int DAYS_TO_CHECK_BEFORE_NOW = 14;

    private ProcessedDateService processedDateService;

    @Mock
    private ProcessedDateRepository processedDateRepository;
    @Mock
    private DateProvider dateProvider;


    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
        Properties properties = new Properties();
        Properties.Downloader downloader = new Properties.Downloader();
        downloader.setDaysToCheckBeforeNow(DAYS_TO_CHECK_BEFORE_NOW);
        properties.setDownloader(downloader);
        processedDateService = new ProcessedDateService(processedDateRepository, dateProvider, properties);
    }

    @Test
    void shouldFetchDateWhenNoDataStored() {

    	// given
        LocalDate now = LocalDate.parse("2020-11-20");
        given(processedDateRepository.listLastProcessedDate(DAYS_TO_CHECK_BEFORE_NOW)).willReturn(ImmutableList.of());
        given(dateProvider.now()).willReturn(now);

        // when
        LocalDate date = processedDateService.fetchDateToProcess();

        // then
        assertThat(date).isEqualTo(now.minusDays(DAYS_TO_CHECK_BEFORE_NOW));
    }

    @Test
    void shouldFetchDateWhenDatesStoredInOrder() {

        // given
        LocalDate now = LocalDate.parse("2020-11-20");
        ArrayList<ProcessedDate> processedDates = Lists.newArrayList(
                new ProcessedDate(now, false),
                new ProcessedDate(now.minusDays(1), true),
                new ProcessedDate(now.minusDays(2), true),
                new ProcessedDate(now.minusDays(3), true),
                new ProcessedDate(now.minusDays(4), true),
                new ProcessedDate(now.minusDays(5), true),
                new ProcessedDate(now.minusDays(6), true),
                new ProcessedDate(now.minusDays(7), true),
                new ProcessedDate(now.minusDays(8), true),
                new ProcessedDate(now.minusDays(9), true),
                new ProcessedDate(now.minusDays(10), true),
                new ProcessedDate(now.minusDays(11), true),
                new ProcessedDate(now.minusDays(12), true),
                new ProcessedDate(now.minusDays(13), true)
        );
        given(processedDateRepository.listLastProcessedDate(DAYS_TO_CHECK_BEFORE_NOW)).willReturn(processedDates);
        given(dateProvider.now()).willReturn(now);

        // when
        LocalDate date = processedDateService.fetchDateToProcess();

        // then
        assertThat(date).isEqualTo(now);
    }

    @Test
    void shouldFetchDateWhenDatesStoredWithoutOrder() {

        // given
        LocalDate now = LocalDate.parse("2020-11-20");
        ArrayList<ProcessedDate> processedDates = Lists.newArrayList(
                new ProcessedDate(now.minusDays(2), false),
                new ProcessedDate(now.minusDays(5), true),
                new ProcessedDate(now.minusDays(6), true),
                new ProcessedDate(now.minusDays(7), true),
                new ProcessedDate(now.minusDays(9), true),
                new ProcessedDate(now.minusDays(13), true),
                new ProcessedDate(now.minusDays(16), true),
                new ProcessedDate(now.minusDays(18), true),
                new ProcessedDate(now.minusDays(19), true),
                new ProcessedDate(now.minusDays(20), true),
                new ProcessedDate(now.minusDays(21), true),
                new ProcessedDate(now.minusDays(22), true),
                new ProcessedDate(now.minusDays(23), true),
                new ProcessedDate(now.minusDays(33), true)
        );
        given(processedDateRepository.listLastProcessedDate(DAYS_TO_CHECK_BEFORE_NOW)).willReturn(processedDates);
        given(dateProvider.now()).willReturn(now);

        // when
        LocalDate date = processedDateService.fetchDateToProcess();

        // then
        assertThat(date).isEqualTo(now.minusDays(2));
    }

    @Test
    void shouldFetchDateWhenAllDatesAreFullyProcessedAndBeforeNow() {

        // given
        LocalDate now = LocalDate.parse("2020-11-20");
        ArrayList<ProcessedDate> processedDates = Lists.newArrayList(
                new ProcessedDate(now.minusDays(3), true),
                new ProcessedDate(now.minusDays(5), true),
                new ProcessedDate(now.minusDays(6), true),
                new ProcessedDate(now.minusDays(7), true),
                new ProcessedDate(now.minusDays(9), true),
                new ProcessedDate(now.minusDays(13), true),
                new ProcessedDate(now.minusDays(16), true)
        );
        given(processedDateRepository.listLastProcessedDate(DAYS_TO_CHECK_BEFORE_NOW)).willReturn(processedDates);
        given(dateProvider.now()).willReturn(now);

        // when
        LocalDate date = processedDateService.fetchDateToProcess();

        // then
        assertThat(date).isEqualTo(now.minusDays(2));
    }

    @Test
    void shouldFetchNextDateWhenDateIsProcessed() {

        // given
        LocalDate now = LocalDate.parse("2020-11-05");
        LocalDate lastProcessedDate = LocalDate.parse("2020-10-22");
        ArrayList<ProcessedDate> processedDates = Lists.newArrayList(
                new ProcessedDate(lastProcessedDate, true)
        );
        given(processedDateRepository.listLastProcessedDate(DAYS_TO_CHECK_BEFORE_NOW)).willReturn(processedDates);
        given(dateProvider.now()).willReturn(now);

        // when
        LocalDate date = processedDateService.fetchDateToProcess();

        // then
        assertThat(date).isEqualTo(lastProcessedDate.plusDays(1));
    }

}