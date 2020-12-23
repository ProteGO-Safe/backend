package pl.gov.mc.protegosafe.efgs.repository;

import com.google.cloud.firestore.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.repository.model.FailedDiagnosisKey;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.util.stream.Collectors.groupingBy;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
@AllArgsConstructor
public class FailedDiagnosisKeysRepository {

    static String FAILED_UPLOADING_COLLECTION_NAME = "failedUploadingToEfgsDiagnosisKeys";
    static int FAILED_KEYS_BATCH_SIZE = 400;
    static int RETRY_BATCH_SIZE = 100;
    static int RETRY_EXPIRATION_DAYS = 14;

    Firestore firestore;

    @SneakyThrows
    public void saveFailedUploadingDiagnosisKeys(List<DiagnosisKey> diagnosisKeys) {
        final AtomicInteger counter = new AtomicInteger();
        final CollectionReference collection = firestore.collection(FAILED_UPLOADING_COLLECTION_NAME);

        diagnosisKeys
                .stream()
                .map(FailedDiagnosisKey::fromDiagnosisKey)
                .collect(groupingBy(it -> counter.getAndIncrement() / FAILED_KEYS_BATCH_SIZE))
                .values()
                .forEach(e -> saveFailedUploadingDiagnosisKeysBatch(e, collection));
    }

    @SneakyThrows
    public void updateFailedUploadingDiagnosisKeys(List<FailedDiagnosisKey> failedDiagnosisKeys) {
        final CollectionReference collection = firestore.collection(FAILED_UPLOADING_COLLECTION_NAME);
        final WriteBatch batch = firestore.batch();
        failedDiagnosisKeys.forEach(k -> updateFailedUploadingDiagnosisKeysBatch(batch, k, collection));
        batch.commit().get();
    }

    @SneakyThrows
    public List<FailedDiagnosisKey> getLimitedFailedDiagnosisKeys() {
        int currentTimestamp = (int) (System.currentTimeMillis() / 1000);

        return firestore.collection(FAILED_UPLOADING_COLLECTION_NAME)
                .whereGreaterThan("createdAt", currentTimestamp - RETRY_EXPIRATION_DAYS * 24 * 60 * 60)
                .orderBy("createdAt", Query.Direction.ASCENDING)
                .limit(RETRY_BATCH_SIZE)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(this::createFailedDiagnosisKeys)
                .collect(Collectors.toUnmodifiableList());
    }

    @SneakyThrows
    public void removeDocument(List<String> ids) {
        final WriteBatch batch = firestore.batch();
        final CollectionReference collection = firestore.collection(FAILED_UPLOADING_COLLECTION_NAME);
        ids.forEach(e -> batch.delete(collection.document(e)));
        batch.commit().get();
    }

    @SneakyThrows
    private void saveFailedUploadingDiagnosisKeysBatch(List<FailedDiagnosisKey> keys, CollectionReference collection) {
        final WriteBatch batch = firestore.batch();
        keys.forEach(f -> batch.set(collection.document(f.getId()), f));
        batch.commit().get();
    }

    @SneakyThrows
    private void updateFailedUploadingDiagnosisKeysBatch(WriteBatch batch, FailedDiagnosisKey failedDiagnosisKey, CollectionReference collection) {
        final DocumentReference document = collection.document(failedDiagnosisKey.getId());

        if (failedDiagnosisKey.getNumberOfRetries() >= 3) {
            batch.delete(document);
        } else {
            batch.update(
                    document,
                    "numberOfRetries", failedDiagnosisKey.getNumberOfRetries() + 1,
                    "updatedAt", now().toEpochSecond(ZoneOffset.UTC)
            );
        }
    }

    private FailedDiagnosisKey createFailedDiagnosisKeys(QueryDocumentSnapshot documentReference) {
        final Map<String, Object> failedDiagnosisKeyMap = (Map<String, Object>) documentReference.toObject(Object.class);

        return FailedDiagnosisKey.fromMap(failedDiagnosisKeyMap);
    }
}
