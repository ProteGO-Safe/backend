package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties("efgs")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Properties {

  String efgsApiUrl;
  String projectId;
  String nbbsLocation;
  String nbtlsLocation;
}
