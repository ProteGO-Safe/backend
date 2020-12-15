package pl.gov.mc.protegosafe.efgs;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteBatch;
import org.assertj.core.api.Assertions;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import pl.gov.mc.protegosafe.efgs.repository.FailedDiagnosisKeysRepository;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.secret.CloudBackendConfig;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Disabled
class EfgsFailedDiagnosisKeysUploaderTest {

    private EfgsFailedDiagnosisKeysUploader efgsFailedDiagnosisKeysUploader;

    @Autowired
    private Firestore firestore;
    @Autowired
    private CloudBackendConfig cloudBackendConfig;
    @Autowired
    private HttpUploader httpUploader;
    @Autowired
    private FailedDiagnosisKeysRepository failedDiagnosisKeysRepository;
    @Autowired
    private EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory;
    @Autowired
    private EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory;
    @Autowired
    private BatchSignatureUtils batchSignatureUtils;

    @BeforeEach
    public void beforeEach() {
        efgsFailedDiagnosisKeysUploader = new EfgsFailedDiagnosisKeysUploader(
                efgsFakeDiagnosisKeysFactory,
                efgsProtoDiagnosisKeyBatchFactory,
                batchSignatureUtils,
                httpUploader,
                failedDiagnosisKeysRepository,
                cloudBackendConfig);
    }

    @Test
    public void shouldUploadDiagnosisKeys() throws Exception {
        final Logger logger = (Logger) LoggerFactory.getLogger(EfgsFailedDiagnosisKeysUploader.class);
        // given
        keys();

        // when
        final ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        listAppender.start();
        logger.addAppender(listAppender);
        efgsFailedDiagnosisKeysUploader.process();

        Assertions.assertThat(listAppender.list)
                .extracting(ILoggingEvent::getMessage, ILoggingEvent::getLevel)
                .contains(
                        Tuple.tuple("started uploading failed keys to efgs", Level.INFO),
                        Tuple.tuple("Uploaded successfully", Level.INFO)
                );
    }

    private void keys() throws Exception {
        final WriteBatch batch = firestore.batch();
        final CollectionReference diagnosisKeys = firestore.collection("failedUploadingToEfgsDiagnosisKeys");

        IntStream.range(0, 10).forEach(e -> {
            final String id = UUID.randomUUID().toString();
            final DiagnosisKey random = DiagnosisKey.random();
            final Map<String, Object> docData = new HashMap<>();
            docData.put("id", id);
            docData.put("keyData", random.getKeyData());
            docData.put("rollingStartIntervalNumber", random.getRollingStartIntervalNumber());
            docData.put("rollingPeriod", random.getRollingPeriod());
            docData.put("transmissionRiskLevel", random.getTransmissionRiskLevel());
            docData.put("visitedCountries", random.getVisitedCountries());
            docData.put("origin", random.getOrigin());
            docData.put("reportType", random.getReportType().name());
            docData.put("daysSinceOnsetOfSymptoms", random.getDaysSinceOnsetOfSymptoms());
            docData.put("createdAt", (int) (System.currentTimeMillis() / 1000) - 10);
            docData.put("updatedAt", (int) (System.currentTimeMillis() / 1000) - 10);
            docData.put("numberOfRetries", 0);

            diagnosisKeys.document(id).create(docData);
        });

        batch.commit().get();
    }
}
