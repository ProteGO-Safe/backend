package pl.gov.mc.protegosafe.efgs.repository;

import com.google.cloud.firestore.*;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Repository;
import pl.gov.mc.protegosafe.efgs.Properties;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static pl.gov.mc.protegosafe.efgs.repository.FirestoreBatchTag.EMPTY_BATCH_TAG;

@Repository
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class FirestoreRepository implements BatchTagRepository, ProcessedDateRepository {

    Firestore firestore;
    String batchTagCollection;

    public FirestoreRepository(Firestore firestore, Properties properties) {
        this.firestore = firestore;
        this.batchTagCollection = properties.getDownloader().getDb().getCollections().getBatchTag();
    }

    @SneakyThrows
    @Override
    public void saveBatchTag(LocalDate date, String batchTag, int sentKeys) {
        String documentId = date.toString();

        DocumentReference docRef = firestore.collection(batchTagCollection)
                .document(documentId);

        FirestoreBatchTag firestoreBatchTag = new FirestoreBatchTag(
                documentId,
                batchTag,
                sentKeys);

        docRef.set(firestoreBatchTag)
                .get();
    }

    @SneakyThrows
    @Override
    public FirestoreBatchTag fetchLastProcessedBatchTag(LocalDate date) {
        String documentId = date.toString();

        return fetchById(documentId)
                .orElse(EMPTY_BATCH_TAG);
    }

    @SneakyThrows
    private Optional<FirestoreBatchTag> fetchById(String documentId) {
        DocumentSnapshot processedBatchTags = firestore.collection(batchTagCollection)
                .document(documentId)
                .get()
                .get();

        return createFirestoreBatchTag(processedBatchTags);
    }

    private Optional<FirestoreBatchTag> createFirestoreBatchTag(DocumentSnapshot documentSnapshot) {
        return Optional.ofNullable(documentSnapshot.toObject(FirestoreBatchTag.class));
    }

    @SneakyThrows
    @Override
    public List<ProcessedDate> listLastProcessedDate(int limit) {
        return firestore.collection(batchTagCollection)
                .orderBy("id", Query.Direction.DESCENDING)
                .limit(limit)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(this::createProcessedDate)
                .collect(Collectors.toUnmodifiableList());
    }

    @SneakyThrows
    @Override
    public void markDateAsProcessed(LocalDate date) {
        String documentId = date.toString();
        DocumentReference documentReference = firestore.collection(batchTagCollection)
                .document(documentId);

        FirestoreBatchTag firestoreBatchTag = new FirestoreBatchTag(documentId, true);
        documentReference.set(firestoreBatchTag)
                .get();
    }

    private ProcessedDate createProcessedDate(QueryDocumentSnapshot snapshot) {
        FirestoreBatchTag firestoreBatchTag = createFirestoreBatchTag(snapshot)
                .orElseThrow(IllegalArgumentException::new);

        String id = firestoreBatchTag.getId();
        LocalDate date = LocalDate.parse(id);
        boolean processed = firestoreBatchTag.isProcessed();

        return new ProcessedDate(date, processed);
    }
}
