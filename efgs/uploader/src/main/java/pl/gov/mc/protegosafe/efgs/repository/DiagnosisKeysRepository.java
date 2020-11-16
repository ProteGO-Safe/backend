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
import pl.gov.mc.protegosafe.efgs.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKeyModel;
import pl.gov.mc.protegosafe.efgs.repository.model.FailedUploadingDiagnosisKey;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;


@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
@AllArgsConstructor
public class DiagnosisKeysRepository {

    static String COLLECTION_NAME = "diagnosisKeys";
    static String FAILED_UPLOADING_COLLECTION_NAME = "failedUploadingToEfgsDiagnosisKeys";
    static int LIMIT = 1000;
    static int THREE_HOURS = 3 * 60 * 60;

    Firestore firestore;

    @SneakyThrows
    public Map<String, DiagnosisKey> getLimitedDiagnosisKeys() {
        int currentTimestamp = (int) (System.currentTimeMillis() / 1000);

        return firestore.collection(COLLECTION_NAME)
                .whereLessThan("createdAt", currentTimestamp - (THREE_HOURS))
                .limit(LIMIT)
                .get()
                .get()
                .getDocuments()
                .stream()
                .collect(Collectors.toMap(DocumentSnapshot::getId, this::createDiagnosisKeys));
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

    @SneakyThrows
    public void removeDocument(String documentId) {
        firestore.collection(COLLECTION_NAME).document(documentId).delete().get();
    }

    @SneakyThrows
    public void saveFailedUploadingDiagnosisKeys(List<DiagnosisKey> diagnosisKeys) {
        String uuid = UUID.randomUUID().toString();
        Long createdAt = now().toEpochSecond(ZoneOffset.UTC);

        FailedUploadingDiagnosisKey failedUploadingDiagnosisKey = new FailedUploadingDiagnosisKey(uuid, createdAt, diagnosisKeys);

        firestore.collection(FAILED_UPLOADING_COLLECTION_NAME).document(uuid)
                .set(failedUploadingDiagnosisKey)
                .get();
    }
}
