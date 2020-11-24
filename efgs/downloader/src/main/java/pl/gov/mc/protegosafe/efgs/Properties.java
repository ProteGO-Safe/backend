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

  Downloader downloader = new Downloader();
  String api;
  Message message = new Message();

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Message {
    String projectId;
    String topicId;
  }

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Downloader {

    Db db = new Db();
    int daysToCheckBeforeNow;

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Db {
      Collections collections = new Collections();

      @Getter
      @Setter
      @FieldDefaults(level = AccessLevel.PRIVATE)
      public static class Collections {
        String batchTag;
      }
    }
  }
}
