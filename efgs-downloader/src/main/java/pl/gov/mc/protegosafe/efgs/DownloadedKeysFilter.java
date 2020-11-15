package pl.gov.mc.protegosafe.efgs;

import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
class DownloadedKeysFilter {

    private static final int ROLLING_START_INTERVAL_LENGTH = 600;

    public List<Key> filter(List<Key> keys) {

        return keys.stream()
                .filter(this::isKeyNotToOld)
                .collect(Collectors.toUnmodifiableList());
    }

    private boolean isKeyNotToOld(Key key) {
        long minimumRollingStart = Instant
                .now()
                .truncatedTo(ChronoUnit.DAYS)
                .minus(15, ChronoUnit.DAYS)
                .getEpochSecond() / ROLLING_START_INTERVAL_LENGTH;

        return minimumRollingStart >= key.getRollingStartIntervalNumber();
    }

}
