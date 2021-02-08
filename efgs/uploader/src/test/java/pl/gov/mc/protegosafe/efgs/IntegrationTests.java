package pl.gov.mc.protegosafe.efgs;

import com.google.cloud.firestore.Firestore;
import pl.gov.mc.protegosafe.efgs.repository.DiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.repository.FailedDiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;
import pl.gov.mc.protegosafe.efgs.utils.WebClientFactory;

public abstract class IntegrationTests {

    protected Properties provideProperties(Mode mode, String projectId, String efgsHost) {
        final Properties properties = new Properties();
        properties.setEfgsApiUrl(efgsHost);
        properties.setMode(mode);
        properties.setProjectId(projectId);
        properties.setDiagnosisKeysFetchDelayFromRepository(1L);

        return properties;
    }

    protected EfgsFakeDiagnosisKeysFactory provideEfgsFakeDiagnosisKeysFactory() {
        return new EfgsFakeDiagnosisKeysFactory();
    }

    protected EfgsProtoDiagnosisKeyBatchFactory provideEfgsProtoDiagnosisKeyBatchFactory() {
        return new EfgsProtoDiagnosisKeyBatchFactory(new BatchSignatureUtils());
    }

    protected BatchSignatureUtils provideBatchSignatureUtils() {
        return new BatchSignatureUtils();
    }

    protected HttpUploader provideHttpUploader(CloudBackendConfig cloudBackendConfig, Properties properties) {
        return new HttpUploader(new WebClientFactory(cloudBackendConfig), properties);
    }

    protected DiagnosisKeysRepository provideDiagnosisKeysRepository(Firestore firestore, Properties properties) {
        return new DiagnosisKeysRepository(firestore, properties);
    }

    protected FailedDiagnosisKeysRepository provideFailedDiagnosisKeysRepository(Firestore firestore) {
        return new FailedDiagnosisKeysRepository(firestore);
    }

    protected CloudBackendConfig provideCloudBackendConfig(String nbtlsCert, String nbbsCert) {
        final CloudBackendConfig cloudBackendConfig = new CloudBackendConfig();
        CloudBackendConfig.Efgs efgs = new CloudBackendConfig.Efgs();
        efgs.setNbbsCert(nbbsCert);
        efgs.setNbtlsCert(nbtlsCert);
        cloudBackendConfig.setEfgs(efgs);

        return cloudBackendConfig;
    }
}
