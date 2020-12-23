package pl.gov.mc.protegosafe.efgs.repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.DiagnosisKeysProcessor;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.Properties;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKeyModel;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class DiagnosisKeysRepository {

    static String COLLECTION_NAME = "diagnosisKeys";
    static int LIMIT = 1000;

    Firestore firestore;
    Long fetchDelay;

    public DiagnosisKeysRepository(Firestore firestore, Properties properties) {
        this.firestore = firestore;
        this.fetchDelay = properties.getDiagnosisKeysFetchDelayFromRepository();
    }

    @SneakyThrows
    public Map<String, DiagnosisKey> getLimitedDiagnosisKeys() {
        int currentTimestamp = (int) (System.currentTimeMillis() / 1000);

        return firestore.collection(COLLECTION_NAME)
                .whereLessThan("createdAt", currentTimestamp - fetchDelay)
                .limit(LIMIT)
                .get()
                .get()
                .getDocuments()
                .stream()
                .collect(Collectors.toMap(DocumentSnapshot::getId, this::createDiagnosisKeys));
    }

    @SneakyThrows
    public void removeDocument(String documentId) {
        firestore.collection(COLLECTION_NAME).document(documentId).delete().get();
    }

    private DiagnosisKey createDiagnosisKeys(QueryDocumentSnapshot documentReference) {
        DiagnosisKeyModel diagnosisKeyModel = documentReference.toObject(DiagnosisKeyModel.class);
        return new DiagnosisKey(
                diagnosisKeyModel.getKey(),
                diagnosisKeyModel.getRollingStartNumber(),
                diagnosisKeyModel.getRollingPeriod(),
                diagnosisKeyModel.getTransmissionRisk()
        );
    }
}
