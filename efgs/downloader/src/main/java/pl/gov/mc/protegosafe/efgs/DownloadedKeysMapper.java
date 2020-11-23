package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.model.Key;
import pl.gov.mc.protegosafe.efgs.model.ReportType;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloadedKeysMapper {

    private static final int DEFAULT_RISK_LEVEL = 8;

    Key map(Key key) {

        long rollingStartIntervalNumber = key.getRollingStartIntervalNumber();
        int rollingPeriod = key.getRollingPeriod();
        String keyData = key.getKeyData();
        ReportType reportType = key.getReportType();

        return new Key(keyData, rollingStartIntervalNumber, rollingPeriod, DEFAULT_RISK_LEVEL, reportType);
    }
}
