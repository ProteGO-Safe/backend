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

    String keyData;
    long rollingStartIntervalNumber;
    int rollingPeriod;
    int transmissionRiskLevel;
}
