package pl.gov.mc.protegosafe.efgs;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.repository.DiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

@Disabled
class EfgsDiagnosisKeysUploaderTest {

    private EfgsDiagnosisKeysUploader efgsDiagnosisKeysUploader;

    @Mock
    CloudBackendConfig cloudBackendConfig;
    @Mock
    EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory;
    @Mock
    EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory;
    @Mock
    BatchSignatureUtils batchSignatureUtils;
    @Mock
    HttpUploader httpUploader;
    @Mock
    DiagnosisKeysRepository diagnosisKeysRepository;

    @BeforeEach
    public void beforeEach() {

        MockitoAnnotations.openMocks(this);

        efgsDiagnosisKeysUploader = new EfgsDiagnosisKeysUploader(
                efgsFakeDiagnosisKeysFactory,
                efgsProtoDiagnosisKeyBatchFactory,
                batchSignatureUtils,
                httpUploader,
                diagnosisKeysRepository,
                cloudBackendConfig);
    }

    @Test
    public void shouldUploadDiagnosisKeys() {

    	// given

    	// when
        efgsDiagnosisKeysUploader.process();

    	// then

    }

}
