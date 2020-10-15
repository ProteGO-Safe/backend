package pl.gov.mc.protegosafe.efgs.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProcessedBatches implements Comparable<ProcessedBatches> {

    String batchTag;
    List<Key> keys;

    @Override
    public int compareTo(ProcessedBatches other) {
        int currentBatchTagAsNumber = batchTagToInt(this.getBatchTag());
        int otherBatchTagAsNumber = batchTagToInt(other.getBatchTag());
        return Integer.compare(currentBatchTagAsNumber, otherBatchTagAsNumber);
    }

    private int batchTagToInt(String batchTag) {
        return Integer.parseInt(batchTag.replace("-", ""));
    }
}
