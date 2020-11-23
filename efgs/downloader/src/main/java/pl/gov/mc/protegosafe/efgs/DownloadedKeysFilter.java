package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.time.ZoneOffset;

import static pl.gov.mc.protegosafe.efgs.model.ReportType.CONFIRMED_TEST;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloadedKeysFilter {

    DateProvider dateProvider;

    private static final int ROLLING_START_INTERVAL_LENGTH = 600;

    boolean filter(Key key) {

        return isKeyNotTooOld(key) && isReportTypeAsConfirmedTest(key);
    }

    private boolean isKeyNotTooOld(Key key) {
        long minimumRollingStart = dateProvider.now()
                .minusDays(15)
                .atStartOfDay()
                .toEpochSecond(ZoneOffset.UTC) / ROLLING_START_INTERVAL_LENGTH;

        return minimumRollingStart <= key.getRollingStartIntervalNumber();
    }

    private boolean isReportTypeAsConfirmedTest(Key key)
    {
        return key.getReportType().equals(CONFIRMED_TEST);
    }
}
