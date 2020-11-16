package pl.gov.mc.protegosafe.efgs.repository;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Getter
public class FirestoreBatchTag {

    public static final FirestoreBatchTag EMPTY_BATCH_TAG = new FirestoreBatchTag();

    String id;
    String batchTag;
    int sentKeys;
    boolean processed;

    FirestoreBatchTag() {
        this.id = null;
        this.batchTag = null;
        this.sentKeys = 0;
        this.processed = false;
    }

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
