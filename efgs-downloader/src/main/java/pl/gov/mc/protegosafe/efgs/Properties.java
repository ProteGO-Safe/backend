/*-
 * ---license-start
 * EU-Federation-Gateway-Service / efgs-simulator
 * ---
 * Copyright (C) 2020 T-Systems International GmbH and all other contributors
 * ---
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ---license-end
 */

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
  @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
  public static class Downloader {

    Certs certs = new Certs();
    Db db = new Db();

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Certs {
      String nbbsLocation;
      String nbtlsLocation;
    }

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Db {
      final Collections collections = new Collections();
      String lastBatchTagField;

      @Getter
      @Setter
      @FieldDefaults(level = AccessLevel.PRIVATE)
      public static class Collections {
        String batchTag;
      }
    }
  }
}
