package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class DownloadedDiagnosisKeyBatchesResponse {

    String batchTag;
    String nextBatchTag;
    ByteArrayResource responseBody;
}
