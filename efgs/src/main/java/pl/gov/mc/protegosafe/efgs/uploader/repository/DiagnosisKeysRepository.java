package pl.gov.mc.protegosafe.efgs.uploader.repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import pl.gov.mc.protegosafe.efgs.uploader.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.uploader.repository.model.DiagnosisKeyModel;
import pl.gov.mc.protegosafe.efgs.uploader.repository.model.FailedUploadingDiagnosisKey;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static pl.gov.mc.protegosafe.efgs.utils.FirestoreProvider.provideFirestore;


@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class DiagnosisKeysRepository {

    static String COLLECTION_NAME = "diagnosisKeys";
    static String FAILED_UPLOADING_COLLECTION_NAME = "failedUploadingToEfgsDiagnosisKeys";
    static int LIMIT = 1000;
    static int THREE_HOURS = 3 * 60 * 60;

    @SneakyThrows
    public Map<String, DiagnosisKey> getLimitedDiagnosisKeys() {
        int currentTimestamp = (int) (System.currentTimeMillis() / 1000);

        Firestore firestore = provideFirestore();

        Map<String, DiagnosisKey> diagnosisKeyMap = firestore.collection(COLLECTION_NAME)
                .whereLessThan("createdAt", currentTimestamp - (THREE_HOURS))
                .limit(LIMIT)
                .get()
                .get()
                .getDocuments()
                .stream()
                .collect(Collectors.toMap(DocumentSnapshot::getId, this::createDiagnosisKeys));

        firestore.close();
        return diagnosisKeyMap;
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
        Firestore firestore = provideFirestore();
        firestore.collection(COLLECTION_NAME).document(documentId).delete().get();
        firestore.close();
    }

    @SneakyThrows
    public void saveFailedUploadingDiagnosisKeys(List<DiagnosisKey> diagnosisKeys) {
        Firestore firestore = provideFirestore();
        String uuid = UUID.randomUUID().toString();
        Long createdAt = now().toEpochSecond(ZoneOffset.UTC);

        FailedUploadingDiagnosisKey failedUploadingDiagnosisKey = new FailedUploadingDiagnosisKey(uuid, createdAt, diagnosisKeys);

        firestore.collection(FAILED_UPLOADING_COLLECTION_NAME).document(uuid)
                .set(failedUploadingDiagnosisKey)
                .get();
    }
}
