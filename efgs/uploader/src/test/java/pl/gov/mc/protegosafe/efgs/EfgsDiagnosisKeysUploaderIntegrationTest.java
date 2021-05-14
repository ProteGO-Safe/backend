package pl.gov.mc.protegosafe.efgs;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled
@SpringBootTest
class EfgsDiagnosisKeysUploaderIntegrationTest {

    @Autowired
    private EfgsDiagnosisKeysUploader efgsDiagnosisKeysUploader;

    @Test
    public void shouldProcessUploadKeysToEfgs() {

    	// given

    	// when
        efgsDiagnosisKeysUploader.process();

    	// then

    }

}