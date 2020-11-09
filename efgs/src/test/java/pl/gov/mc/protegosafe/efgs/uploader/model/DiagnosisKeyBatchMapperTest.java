package pl.gov.mc.protegosafe.efgs.uploader.model;


import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import static pl.gov.mc.protegosafe.efgs.TestData.VALID_JSON_FROM_FIRESTORE;

class DiagnosisKeyBatchMapperTest {

    @Test
    public void shouldMapUploadedKeyToDiagnosisKeyBatch() {

    	// given


    	// when
        DiagnosisKeyBatch diagnosisKeyBatch = UploadedDiagnosisKeysMapper.createUploadedDiagnosisKeys(VALID_JSON_FROM_FIRESTORE);

    	// then
        Assertions.assertThat(diagnosisKeyBatch.getKeysList()).hasSize(3);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getKeyData).isEqualTo("NYDjc+pDsgcyzy3fFuOjgw==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2671081);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(0)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getKeyData).isEqualTo("eil+iTUg4Yes57Xqt6LFIg==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2671081);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(1)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getKeyData).isEqualTo("6KPHh/EWqw3pUb+aXX/QAg==");
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getRollingPeriod).isEqualTo(144);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getRollingStartIntervalNumber).isEqualTo(2671081);
        Assertions.assertThat(diagnosisKeyBatch.getKeysList().get(2)).extracting(DiagnosisKey::getTransmissionRiskLevel).isEqualTo(8);
    }

}
