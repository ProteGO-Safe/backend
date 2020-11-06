package pl.gov.mc.protegosafe.efgs.repository.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LastProcessedBatchTag {

    public static final LastProcessedBatchTag EMPTY_LAST_PROCESSED_BATCH_TAG = new LastProcessedBatchTag(null, 0);
    String batchTag;
    int offset;
}
