package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloadedKeysFilter {

    DateProvider dateProvider;

    private static final int ROLLING_START_INTERVAL_LENGTH = 600;

    List<Key> filter(List<Key> keys) {

        return keys.stream()
                .filter(this::isKeyNotToOld)
                .collect(Collectors.toUnmodifiableList());
    }

    private boolean isKeyNotToOld(Key key) {
        long minimumRollingStart = dateProvider.now()
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant()
                .truncatedTo(ChronoUnit.DAYS)
                .minus(15, ChronoUnit.DAYS)
                .getEpochSecond() / ROLLING_START_INTERVAL_LENGTH;

        return minimumRollingStart <= key.getRollingStartIntervalNumber();
    }

}
