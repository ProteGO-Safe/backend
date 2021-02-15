package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;

@Slf4j
abstract public class DiagnosisKeysUploader {

    private static final int MAX_DIAGNOSIS_KEY_BATCH = 200;

    String nbbsCert;
    EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory;
    EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory;
    BatchSignatureUtils batchSignatureUtils;
    HttpUploader httpUploader;

    public DiagnosisKeysUploader(
            EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory,
            EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory,
            BatchSignatureUtils batchSignatureUtils,
            HttpUploader httpUploader,
            CloudBackendConfig cloudBackendConfig) {
        this.nbbsCert = cloudBackendConfig.getNbbsCert();
        this.efgsFakeDiagnosisKeysFactory = efgsFakeDiagnosisKeysFactory;
        this.efgsProtoDiagnosisKeyBatchFactory = efgsProtoDiagnosisKeyBatchFactory;
        this.batchSignatureUtils = batchSignatureUtils;
        this.httpUploader = httpUploader;
    }

    protected boolean signAndUpload(List<DiagnosisKey> diagnosisKeyBatch, boolean isRetry) {
        final List<DiagnosisKey> filledCollection = efgsFakeDiagnosisKeysFactory.fillFakesDiagnosisKeys(diagnosisKeyBatch, MAX_DIAGNOSIS_KEY_BATCH);

        log.info("Processing {}, original keys: {}, fake keys: {}",
                isRetry ? "retry" : "upload",
                diagnosisKeyBatch.size(),
                filledCollection.size() - diagnosisKeyBatch.size()
        );

        final EfgsProto.DiagnosisKeyBatch batch = efgsProtoDiagnosisKeyBatchFactory.create(filledCollection);
        final byte[] bytes = batchSignatureUtils.generateBytesToVerify(batch);
        final SignatureGenerator signatureGenerator = new SignatureGenerator(nbbsCert);
        final String signatureForBytes = signatureGenerator.getSignatureForBytes(bytes);
        final String randomBatchTag = RandomStringUtils.random(10, true, true);
        final HttpStatus httpStatus = httpUploader.uploadDiagnosisKeyBatch(batch, randomBatchTag, signatureForBytes);

        return OK.equals(httpStatus) || CONFLICT.equals(httpStatus);
    }
}
