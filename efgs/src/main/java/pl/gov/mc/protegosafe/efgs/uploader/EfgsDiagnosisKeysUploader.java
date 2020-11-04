package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.cloud.functions.Context;
import com.google.cloud.functions.RawBackgroundFunction;
import eu.interop.federationgateway.model.EfgsProto;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.util.Assert;
import pl.gov.mc.protegosafe.efgs.uploader.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.uploader.model.DiagnosisKeyBatch;
import pl.gov.mc.protegosafe.efgs.uploader.model.UploadedDiagnosisKeysMapper;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_NBBS_LOCATION;

public class EfgsDiagnosisKeysUploader implements RawBackgroundFunction {

    private static final int MAX_DIAGNOSIS_KEY_BATCH = 5000;

    @Override
    public void accept(String json, Context context) {

        DiagnosisKeyBatch diagnosisKeyBatch = UploadedDiagnosisKeysMapper.createUploadedDiagnosisKeys(json);
        Assert.isTrue(diagnosisKeyBatch.isInteroperabilityEnabled(), "isInteroperabilityEnabled must be true");

        EfgsFakeDiagnosisKeysFactory factory = new EfgsFakeDiagnosisKeysFactory();
        List<DiagnosisKey> filledCollection = factory.fillFakesDiagnosisKeys(diagnosisKeyBatch.getKeysList(), MAX_DIAGNOSIS_KEY_BATCH);
        EfgsProto.DiagnosisKeyBatch batch = EfgsProtoDiagnosisKeyBatchFactory.create(filledCollection);
        byte[] bytes = BatchSignatureUtils.generateBytesToVerify(batch);
        SignatureGenerator signatureGenerator = new SignatureGenerator(ENV_NBBS_LOCATION);
        String signatureForBytes = signatureGenerator.getSignatureForBytes(bytes);
        String randomBatchTag = getRandomBatchTag();

        HttpUploader.uploadDiagnosisKeyBatch(batch, randomBatchTag, signatureForBytes);
    }

    private String getRandomBatchTag() {
        return RandomStringUtils.random(10, true, true);
    }
}
