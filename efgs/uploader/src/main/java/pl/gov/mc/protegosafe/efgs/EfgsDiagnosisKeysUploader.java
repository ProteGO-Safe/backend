package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.DiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class EfgsDiagnosisKeysUploader {

    private static final int MAX_DIAGNOSIS_KEY_BATCH = 1000;

    String nbbsCert;
    EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory;
    EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory;
    BatchSignatureUtils batchSignatureUtils;
    HttpUploader httpUploader;
    DiagnosisKeysRepository diagnosisKeysRepository;

    @Autowired
    EfgsDiagnosisKeysUploader(
            EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory,
            EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory,
            BatchSignatureUtils batchSignatureUtils,
            HttpUploader httpUploader,
            DiagnosisKeysRepository diagnosisKeysRepository,
            CloudBackendConfig cloudBackendConfig) {
        this.nbbsCert = cloudBackendConfig.getNbbsCert();
        this.efgsFakeDiagnosisKeysFactory = efgsFakeDiagnosisKeysFactory;
        this.efgsProtoDiagnosisKeyBatchFactory = efgsProtoDiagnosisKeyBatchFactory;
        this.batchSignatureUtils = batchSignatureUtils;
        this.httpUploader = httpUploader;
        this.diagnosisKeysRepository = diagnosisKeysRepository;
    }

    void process() {

        log.info("started uploading keys to efgs");

        Map<String, DiagnosisKey> idsWithDiagnosisKeys = getDocuments();
        List<DiagnosisKey> diagnosisKeyBatch = createDiagnosisKeyList(idsWithDiagnosisKeys);

        if (diagnosisKeyBatch.isEmpty()) {
            log.info("No data to upload");
            return;
        }

        List<DiagnosisKey> filledCollection = efgsFakeDiagnosisKeysFactory.fillFakesDiagnosisKeys(diagnosisKeyBatch, MAX_DIAGNOSIS_KEY_BATCH);

        log.info("Processing upload, original keys: {}, fake keys: {}", diagnosisKeyBatch.size(), filledCollection.size() - diagnosisKeyBatch.size());

        EfgsProto.DiagnosisKeyBatch batch = efgsProtoDiagnosisKeyBatchFactory.create(filledCollection);

        byte[] bytes = batchSignatureUtils.generateBytesToVerify(batch);
        SignatureGenerator signatureGenerator = new SignatureGenerator(nbbsCert);
        String signatureForBytes = signatureGenerator.getSignatureForBytes(bytes);

        String randomBatchTag = getRandomBatchTag();

        boolean isSuccessResponse = httpUploader.uploadDiagnosisKeyBatch(batch, randomBatchTag, signatureForBytes);

        if (!isSuccessResponse) {
            processFailedUploading(diagnosisKeyBatch);

        }
        idsWithDiagnosisKeys.keySet()
                .forEach(this::removeDocuments);
    }


    private void removeDocuments(String documentId) {
        diagnosisKeysRepository.removeDocument(documentId);
    }

    private void processFailedUploading(List<DiagnosisKey> diagnosisKeys) {
        diagnosisKeysRepository.saveFailedUploadingDiagnosisKeys(diagnosisKeys);
    }

    private String getRandomBatchTag() {
        return RandomStringUtils.random(10, true, true);
    }

    private Map<String ,DiagnosisKey> getDocuments() {
        return diagnosisKeysRepository.getLimitedDiagnosisKeys();
    }

    private List<DiagnosisKey> createDiagnosisKeyList(Map<String ,DiagnosisKey> documents) {
        return documents.values()
                .stream()
                .collect(Collectors.toUnmodifiableList());
    }
}
