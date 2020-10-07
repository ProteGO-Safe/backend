package pl.gov.mc.protegosafe.efgs.downloader;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProcessedDownloadedDiagnosisKeyBatches implements Comparable<ProcessedDownloadedDiagnosisKeyBatches> {

    String batchTag;
    String responseBody;

    @Override
    public int compareTo(ProcessedDownloadedDiagnosisKeyBatches other) {
        int currentBatchTagAsNumber = batchTagToInt(this.getBatchTag());
        int otherBatchTagAsNumber = batchTagToInt(other.getBatchTag());
        return Integer.compare(currentBatchTagAsNumber, otherBatchTagAsNumber);
    }

    private int batchTagToInt(String batchTag) {
        return Integer.parseInt(batchTag.replace("-", ""));
    }
}
