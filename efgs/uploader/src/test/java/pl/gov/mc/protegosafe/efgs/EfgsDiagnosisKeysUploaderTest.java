package pl.gov.mc.protegosafe.efgs;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.WriteBatch;
import org.assertj.core.api.Assertions;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static java.lang.System.getenv;
import static java.util.stream.IntStream.range;
import static org.testcontainers.utility.DockerImageName.parse;

@Testcontainers
class EfgsDiagnosisKeysUploaderTest extends IntegrationTests {

    private static final String PROJECT_ID = "project-test";
    private static final String EFGS_HOST = getenv("EFGS_URL");
    private static final String NBTLS_CERT = getenv("NBTLS");
    private static final String NBBS_CERT = getenv("NBBS");

    private EfgsDiagnosisKeysUploader efgsDiagnosisKeysUploader;
    private Firestore firestore;

    @Container
    public final GenericContainer container = new GenericContainer<>(parse("pathmotion/firestore-emulator-docker"))
            .withEnv("FIRESTORE_PROJECT_ID", PROJECT_ID)
            .withExposedPorts(8088)
            .waitingFor(
                    Wait.forHttp("/")
                            .forStatusCode(200)
            );

    @BeforeEach
    public void beforeEach() {
        final CloudBackendConfig cloudBackendConfig = provideCloudBackendConfig(
                new String(Base64.getDecoder().decode(NBTLS_CERT)),
                new String(Base64.getDecoder().decode(NBBS_CERT))
        );

        final Properties properties = provideProperties(Mode.UPLOAD_KEYS, PROJECT_ID, EFGS_HOST);

        firestore = FirestoreOptions.newBuilder()
                .setProjectId(PROJECT_ID)
                .setEmulatorHost(container.getHost() + ":" + container.getMappedPort(8088))
                .build()
                .getService();

        efgsDiagnosisKeysUploader = new EfgsDiagnosisKeysUploader(
                provideEfgsFakeDiagnosisKeysFactory(),
                provideEfgsProtoDiagnosisKeyBatchFactory(),
                provideBatchSignatureUtils(),
                provideHttpUploader(cloudBackendConfig, properties),
                provideDiagnosisKeysRepository(firestore, properties),
                provideFailedDiagnosisKeysRepository(firestore),
                cloudBackendConfig
        );
    }

    @Test
    public void shouldUploadDiagnosisKeys() throws Exception {
        final Logger logger = (Logger) LoggerFactory.getLogger(EfgsDiagnosisKeysUploader.class);
        // given
        keys();

        // when
        final ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        listAppender.start();
        logger.addAppender(listAppender);
        efgsDiagnosisKeysUploader.process();

        Assertions.assertThat(listAppender.list)
                .extracting(ILoggingEvent::getMessage, ILoggingEvent::getLevel)
                .contains(
                        Tuple.tuple("started uploading keys to efgs", Level.INFO),
                        Tuple.tuple("Uploaded finished", Level.INFO)
                );
    }

    private void keys() throws Exception {
        final WriteBatch batch = firestore.batch();
        final CollectionReference diagnosisKeys = firestore.collection("diagnosisKeys");

        range(0, 10).forEach(e -> {
            final String id = UUID.randomUUID().toString();
            final DiagnosisKey random = DiagnosisKey.random();
            final Map<String, Object> docData = new HashMap<>();
            docData.put("createdAt", (int) (System.currentTimeMillis() / 1000) - 108001);
            docData.put("id", id);
            docData.put("key", random.getKeyData());
            docData.put("rollingPeriod", random.getRollingPeriod());
            docData.put("rollingStartNumber", random.getRollingStartIntervalNumber());
            docData.put("transmissionRisk", random.getTransmissionRiskLevel());

            diagnosisKeys.document(id).create(docData);
        });

        batch.commit().get();
        Thread.sleep(3000);
    }
}
