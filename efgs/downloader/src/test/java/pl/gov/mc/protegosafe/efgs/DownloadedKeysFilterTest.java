package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;
import eu.interop.federationgateway.model.EfgsProto;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.mockito.BDDMockito.given;

class DownloadedKeysFilterTest {

    private static final int ROLLING_START_INTERVAL_LENGTH = 600;

    private DownloadedKeysFilter downloadedKeysFilter;

    @Mock
    private DateProvider dateProvider;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
        downloadedKeysFilter = new DownloadedKeysFilter(dateProvider);
    }

    @Test
    void shouldFilterKeysByDate() {

    	// given
        LocalDate now = LocalDate.parse("2020-11-30");
        given(dateProvider.now()).willReturn(now);
        Key validKey1 = createKey(LocalDateTime.parse("2020-11-30T10:10:00"));
        Key validKey2 = createKey(LocalDateTime.parse("2020-11-15T10:10:00"));
        Key validKey3 = createKey(LocalDateTime.parse("2020-11-15T00:00:00"));
        Key invalidKey1 = createKey(LocalDateTime.parse("2020-11-14T23:50:00"));
        List<Key> keys = Lists.newArrayList(
                validKey1,
                validKey2,
                validKey3,
                invalidKey1
        );

        // when
        List<Key> filteredKeys = downloadedKeysFilter.filter(keys);

        // then
        Assertions.assertThat(filteredKeys).contains(validKey1, validKey2, validKey3);
        Assertions.assertThat(filteredKeys).doesNotContain(invalidKey1);
    }


    @Test
    void shouldFilterKeysReportType() {

        // given
        LocalDate now = LocalDate.parse("2020-11-30");
        given(dateProvider.now()).willReturn(now);

        Key invalidKey1 = createKey(LocalDateTime.parse("2020-11-30T10:10:00"), EfgsProto.ReportType.SELF_REPORT_VALUE);
        Key invalidKey2 = createKey(LocalDateTime.parse("2020-11-15T10:10:00"), EfgsProto.ReportType.RECURSIVE_VALUE);
        Key validKey1 = createKey(LocalDateTime.parse("2020-11-15T00:00:00"), EfgsProto.ReportType.CONFIRMED_TEST_VALUE);
        Key validKey2 = createKey(LocalDateTime.parse("2020-11-16T23:50:00"), EfgsProto.ReportType.CONFIRMED_TEST_VALUE);

        List<Key> keys = Lists.newArrayList(
                invalidKey1,
                invalidKey2,
                validKey1,
                validKey2
        );

        // when
        List<Key> filteredKeys = downloadedKeysFilter.filter(keys);

        // then
        Assertions.assertThat(filteredKeys).contains(validKey1, validKey2);
        Assertions.assertThat(filteredKeys).doesNotContain(invalidKey1, invalidKey2);
    }

    private Key createKey(LocalDateTime rollingStartTime) {
        return createKey(rollingStartTime, EfgsProto.ReportType.CONFIRMED_TEST_VALUE);
    }

    private Key createKey(LocalDateTime rollingStartTime, int reportType) {

        long rollingStartIntervalNumber = rollingStartTime.toEpochSecond(ZoneOffset.UTC) / ROLLING_START_INTERVAL_LENGTH;

        return new Key(RandomStringUtils.randomAlphabetic(10),
                rollingStartIntervalNumber,
                144,
                RandomUtils.nextInt(),
                reportType
        );
    }

}
