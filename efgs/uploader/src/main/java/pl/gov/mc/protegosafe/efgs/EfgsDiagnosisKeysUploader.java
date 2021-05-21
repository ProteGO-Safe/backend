package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.DiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.repository.FailedDiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class EfgsDiagnosisKeysUploader extends DiagnosisKeysUploader implements DiagnosisKeysProcessor {

    private final DiagnosisKeysRepository diagnosisKeysRepository;
    private final FailedDiagnosisKeysRepository failedDiagnosisKeysRepository;

    @Autowired
    EfgsDiagnosisKeysUploader(
            EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory,
            EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory,
            BatchSignatureUtils batchSignatureUtils,
            HttpUploader httpUploader,
            DiagnosisKeysRepository diagnosisKeysRepository,
            FailedDiagnosisKeysRepository failedDiagnosisKeysRepository,
            CloudBackendConfig cloudBackendConfig) {
        super(efgsFakeDiagnosisKeysFactory, efgsProtoDiagnosisKeyBatchFactory, batchSignatureUtils, httpUploader, cloudBackendConfig);
        this.diagnosisKeysRepository = diagnosisKeysRepository;
        this.failedDiagnosisKeysRepository = failedDiagnosisKeysRepository;
    }

    public void process() {
        log.info("started uploading keys to efgs");

        final Map<String, DiagnosisKey> idsWithDiagnosisKeys = diagnosisKeysRepository.getLimitedDiagnosisKeys();
        final List<DiagnosisKey> diagnosisKeyBatch = idsWithDiagnosisKeys
                .values()
                .stream()
                .collect(Collectors.toUnmodifiableList());

        if (diagnosisKeyBatch.isEmpty()) {
            log.info("No data to upload");
            return;
        }

        final boolean shouldFinishUploading = signAndUpload(diagnosisKeyBatch, false);

        if (!shouldFinishUploading) {
            failedDiagnosisKeysRepository.saveFailedUploadingDiagnosisKeys(diagnosisKeyBatch);
            log.info("Saved failed uploading keys");
        } else {
            log.info("Uploaded finished");
        }

        idsWithDiagnosisKeys
                .keySet()
                .forEach(this::removeDocuments);

        log.info("finished uploading keys to efgs");
    }

    @Override
    public Boolean isApplicable(Mode mode) {
        return Mode.UPLOAD_KEYS.equals(mode);
    }

    private void removeDocuments(String documentId) {
        diagnosisKeysRepository.removeDocument(documentId);
    }
}
