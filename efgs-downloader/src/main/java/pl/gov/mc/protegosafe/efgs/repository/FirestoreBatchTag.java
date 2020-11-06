package pl.gov.mc.protegosafe.efgs.repository;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@NoArgsConstructor
public class FirestoreBatchTag {

    String id;
    String batchTag;
    int sentKeys;
    boolean processed;

    FirestoreBatchTag(String id, boolean processed) {
        this.id = id;
        this.batchTag = null;
        this.sentKeys = 0;
        this.processed = processed;
    }

    FirestoreBatchTag(String id, String batchTag, int sentKeys) {
        this.id = id;
        this.batchTag = batchTag;
        this.sentKeys = sentKeys;
        this.processed = false;
    }
}
