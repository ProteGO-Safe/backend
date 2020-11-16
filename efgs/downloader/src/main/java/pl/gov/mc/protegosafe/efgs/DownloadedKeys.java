package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.ImmutableList;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.List;

@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Getter
class DownloadedKeys {

    static DownloadedKeys EMPTY_DOWNLOADED_KEYS = new DownloadedKeys(null, null);

    List<Key> keys;
    String batchTag;
    String nextBatchTag;

    DownloadedKeys(String batchTag, String nextBatchTag) {
        this.keys = ImmutableList.of();
        this.batchTag = batchTag;
        this.nextBatchTag = nextBatchTag;
    }
}
