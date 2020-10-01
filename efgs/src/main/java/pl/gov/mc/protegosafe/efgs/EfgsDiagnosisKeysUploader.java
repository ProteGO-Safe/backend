package pl.gov.mc.protegosafe.efgs;

import com.google.cloud.functions.Context;
import com.google.cloud.functions.RawBackgroundFunction;
import eu.interop.federationgateway.model.EfgsProto;
import org.apache.commons.lang3.RandomStringUtils;
import pl.gov.mc.protegosafe.efgs.model.DiagnosisKeyBatch;
import pl.gov.mc.protegosafe.efgs.model.UploadedDiagnosisKeysMapper;

import static pl.gov.mc.protegosafe.efgs.AssertUtils.isTrue;

public class EfgsDiagnosisKeysUploader implements RawBackgroundFunction {

    @Override
    public void accept(String json, Context context) {

        DiagnosisKeyBatch diagnosisKeyBatch = UploadedDiagnosisKeysMapper.createUploadedDiagnosisKeys(json);

        isTrue(diagnosisKeyBatch.isAllowSentToEfgs(), Boolean::booleanValue, () -> new RuntimeException("allowSentToEfgs must be true"));

        EfgsProto.DiagnosisKeyBatch batch = EfgsProtoDiagnosisKeyBatchFatory.create(diagnosisKeyBatch);
        byte[] bytes = BatchSignatureUtils.generateBytesToVerify(batch);
        SignatureGenerator signatureGenerator = new SignatureGenerator(System.getenv("NBBS_LOCATION"));
        String signatureForBytes = signatureGenerator.getSignatureForBytes(bytes);
        String randomBatchTag = getRandomBatchTag();

        EfgsSimulatorService.uploadDiagnosisKeyBatch(batch, randomBatchTag, signatureForBytes);
    }

    private String getRandomBatchTag() {
        return RandomStringUtils.random(10, true, true);
    }
}