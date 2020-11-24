package pl.gov.mc.protegosafe.efgs.repository.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import pl.gov.mc.protegosafe.efgs.DiagnosisKey;

import java.util.List;

@AllArgsConstructor
@Getter
public class FailedUploadingDiagnosisKey {

    private final String id;
    private final Long createdAt;
    private final List<DiagnosisKey> diagnosisKeys;
}
