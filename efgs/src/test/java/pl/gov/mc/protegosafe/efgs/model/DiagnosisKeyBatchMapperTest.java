package pl.gov.mc.protegosafe.efgs.model;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static pl.gov.mc.protegosafe.efgs.TestData.VALID_JSON_FROM_FIRESTORE;

class DiagnosisKeyBatchMapperTest {

    private UploadedDiagnosisKeysMapper uploadedDiagnosisKeysMapper;

    @BeforeEach
    public void beforeEach() {
        uploadedDiagnosisKeysMapper = new UploadedDiagnosisKeysMapper();
    }

    @Test
    public void shouldMapUploadedKeyToDiagnosisKeyBatch() {

    	// given


    	// when
        DiagnosisKeyBatch diagnosisKeyBatch = uploadedDiagnosisKeysMapper.createUploadedDiagnosisKeys(VALID_JSON_FROM_FIRESTORE);

    	// then
        Assertions.assertThat(diagnosisKeyBatch.getKeysList()).hasSize(3);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getKeyData).isEqualTo("5MI/219zoJdPqaXQDR0YTQ==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2666440);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getKeyData).isEqualTo("ESartjbxqW0z1qfZ3pwW2Q==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2666296);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getKeyData).isEqualTo("qrcyBtITrUeDxrS7PoiMyg==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2666008);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);

        System.out.println(1);

    }

}