package pl.gov.mc.protegosafe.efgs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode
public class Key {

    private static final int DEFAULT_RISK_LEVEL = 8;

    String keyData;
    long rollingStartIntervalNumber;
    int rollingPeriod;
    int transmissionRiskLevel;
    int reportType;

    public int getTransmissionRiskLevel() {
        return DEFAULT_RISK_LEVEL;
    }
}
