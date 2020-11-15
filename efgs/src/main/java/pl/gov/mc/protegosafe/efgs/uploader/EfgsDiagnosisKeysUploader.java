package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.cloud.functions.Context;
import com.google.cloud.functions.RawBackgroundFunction;
import eu.interop.federationgateway.model.EfgsProto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import pl.gov.mc.protegosafe.efgs.uploader.repository.DiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_NBBS_LOCATION;


@Slf4j
public class EfgsDiagnosisKeysUploader implements RawBackgroundFunction {

    private static final int MAX_DIAGNOSIS_KEY_BATCH = 1000;

    @Override
    public void accept(String json, Context context) {

        log.info("started uploading keys to efgs");

        Map<String, DiagnosisKey> idsWithDiagnosisKeys = getDocuments();
        List<DiagnosisKey> diagnosisKeyBatch = createDiagnosisKeyList(idsWithDiagnosisKeys);

        if (diagnosisKeyBatch.isEmpty()) {
            log.info("No data to upload");
            return;
        }

        List<DiagnosisKey> filledCollection = EfgsFakeDiagnosisKeysFactory.fillFakesDiagnosisKeys(diagnosisKeyBatch, MAX_DIAGNOSIS_KEY_BATCH);

        log.info("Processing upload, original keys: {}, fake keys: {}", diagnosisKeyBatch.size(), filledCollection.size() - diagnosisKeyBatch.size());

        EfgsProto.DiagnosisKeyBatch batch = EfgsProtoDiagnosisKeyBatchFactory.create(filledCollection);

        byte[] bytes = BatchSignatureUtils.generateBytesToVerify(batch);
        SignatureGenerator signatureGenerator = new SignatureGenerator(ENV_NBBS_LOCATION);
        String signatureForBytes = signatureGenerator.getSignatureForBytes(bytes);

        String randomBatchTag = getRandomBatchTag();

        boolean isSuccessResponse = HttpUploader.uploadDiagnosisKeyBatch(batch, randomBatchTag, signatureForBytes);

        if (isSuccessResponse) {
            idsWithDiagnosisKeys.keySet()
                    .forEach(this::removeDocuments);
        } else {
            processFailedUploading(diagnosisKeyBatch);
        }
    }


    private void removeDocuments(String documentId) {
        DiagnosisKeysRepository repository = new DiagnosisKeysRepository();
        repository.removeDocument(documentId);
    }

    private void processFailedUploading(List<DiagnosisKey> diagnosisKeys) {
        DiagnosisKeysRepository repository = new DiagnosisKeysRepository();
        repository.saveFailedUploadingDiagnosisKeys(diagnosisKeys);
    }

    private String getRandomBatchTag() {
        return RandomStringUtils.random(10, true, true);
    }

    private Map<String ,DiagnosisKey> getDocuments() {
        DiagnosisKeysRepository repository = new DiagnosisKeysRepository();
        return repository.getLimitedDiagnosisKeys();
    }

    private List<DiagnosisKey> createDiagnosisKeyList(Map<String ,DiagnosisKey> documents) {
        return documents.values()
                .stream()
                .collect(Collectors.toUnmodifiableList());
    }
}
