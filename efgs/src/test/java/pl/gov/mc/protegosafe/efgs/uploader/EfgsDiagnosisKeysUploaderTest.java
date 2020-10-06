package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.cloud.functions.Context;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.TestData;

class EfgsDiagnosisKeysUploaderTest {

    private EfgsDiagnosisKeysUploader efgsDiagnosisKeysUploader;

    @Mock
    private Context context;

    @BeforeEach
    public void beforeEach() {
        efgsDiagnosisKeysUploader = new EfgsDiagnosisKeysUploader();
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void should() {

    	// given

    	// when
        efgsDiagnosisKeysUploader.accept(TestData.VALID_JSON_FROM_FIRESTORE, context);

    	// then

    }

}
