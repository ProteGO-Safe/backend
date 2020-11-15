package pl.gov.mc.protegosafe.efgs.uploader.repository.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import pl.gov.mc.protegosafe.efgs.uploader.DiagnosisKey;

import java.util.List;

@AllArgsConstructor
@Getter
public class FailedUploadingDiagnosisKey {

    private final String id;
    private final Long createdAt;
    private final List<DiagnosisKey> diagnosisKeys;
}
