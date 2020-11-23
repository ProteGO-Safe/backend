package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.model.ReportType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Stream;

import static java.time.LocalDateTime.parse;
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

    @ParameterizedTest
    @MethodSource
    void shouldFilterKeysByDate(Key key, boolean isValid) {

    	// given
        LocalDate now = LocalDate.parse("2020-11-30");
        given(dateProvider.now()).willReturn(now);
        Key validKey1 = createKey(parse("2020-11-30T10:10:00"));
        Key validKey2 = createKey(parse("2020-11-15T10:10:00"));
        Key validKey3 = createKey(parse("2020-11-15T00:00:00"));
        Key invalidKey1 = createKey(parse("2020-11-14T23:50:00"));
        List<Key> keys = Lists.newArrayList(
                validKey1,
                validKey2,
                validKey3,
                invalidKey1
        );

        // when
        boolean filter = downloadedKeysFilter.filter(key);

        // then
        Assertions.assertThat(filter).isEqualTo(isValid);
    }

    private static Stream<Arguments> shouldFilterKeysByDate() {
        return Stream.of(
                Arguments.of(createKey(parse("2020-11-30T10:10:00")), true),
                Arguments.of(createKey(parse("2020-11-15T10:10:00")), true),
                Arguments.of(createKey(parse("2020-11-15T00:00:00")), true),
                Arguments.of(createKey(parse("2020-11-14T23:50:00")), false),
                Arguments.of(createKey(parse("2020-11-15T00:00:00"), ReportType.CONFIRMED_TEST), true),
                Arguments.of(createKey(parse("2020-11-15T00:00:00"), ReportType.SELF_REPORT), false),
                Arguments.of(createKey(parse("2020-11-15T00:00:00"), ReportType.RECURSIVE), false)
        );
    }

    private static Key createKey(LocalDateTime rollingStartTime) {
        return createKey(rollingStartTime, ReportType.CONFIRMED_TEST);
    }

    private static Key createKey(LocalDateTime rollingStartTime, ReportType reportType) {

        long rollingStartIntervalNumber = rollingStartTime.toEpochSecond(ZoneOffset.UTC) / ROLLING_START_INTERVAL_LENGTH;

        return new Key(RandomStringUtils.randomAlphabetic(10),
                rollingStartIntervalNumber,
                144,
                RandomUtils.nextInt(),
                reportType
        );
    }

}
