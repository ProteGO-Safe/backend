package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.FailedDiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.repository.model.FailedDiagnosisKey;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class EfgsFailedDiagnosisKeysUploader extends DiagnosisKeysUploader implements DiagnosisKeysProcessor {

    private final FailedDiagnosisKeysRepository failedDiagnosisKeysRepository;

    @Autowired
    EfgsFailedDiagnosisKeysUploader(
            EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory,
            EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory,
            BatchSignatureUtils batchSignatureUtils,
            HttpUploader httpUploader,
            FailedDiagnosisKeysRepository failedDiagnosisKeysRepository,
            CloudBackendConfig cloudBackendConfig) {
        super(efgsFakeDiagnosisKeysFactory, efgsProtoDiagnosisKeyBatchFactory, batchSignatureUtils, httpUploader, cloudBackendConfig);
        this.failedDiagnosisKeysRepository = failedDiagnosisKeysRepository;
    }

    public void process() {
        log.info("started uploading failed keys to efgs");

        final List<FailedDiagnosisKey> failedDiagnosisKeys = failedDiagnosisKeysRepository.getLimitedFailedDiagnosisKeys();

        if (failedDiagnosisKeys.isEmpty()) {
            log.info("No failed keys to upload");
            return;
        }

        final List<DiagnosisKey> diagnosisKeyBatch = failedDiagnosisKeys
                .stream()
                .map(FailedDiagnosisKey::fromFailedDiagnosisKey)
                .collect(Collectors.toUnmodifiableList());

        final boolean shouldFinishUploading = signAndUpload(diagnosisKeyBatch, true);

        if (!shouldFinishUploading) {
            failedDiagnosisKeysRepository.updateFailedUploadingDiagnosisKeys(failedDiagnosisKeys);
            log.info("Updated failed uploading keys");
        } else {
            log.info("Uploaded finished");
            failedDiagnosisKeysRepository
                    .removeDocument(failedDiagnosisKeys
                            .stream()
                            .map(FailedDiagnosisKey::getId)
                            .collect(toList())
                    );
        }
        log.info("finished uploading failed keys to efgs");
    }

    @Override
    public Boolean isApplicable(Mode mode) {
        return Mode.RETRY_KEYS.equals(mode);
    }
}
