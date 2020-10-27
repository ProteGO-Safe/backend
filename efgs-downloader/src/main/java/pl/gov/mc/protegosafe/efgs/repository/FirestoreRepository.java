package pl.gov.mc.protegosafe.efgs.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Repository;
import pl.gov.mc.protegosafe.efgs.Properties;
import pl.gov.mc.protegosafe.efgs.repository.model.LastProcessedBatchTag;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Repository
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class FirestoreRepository implements BatchTagRepository {

    Firestore firestore;
    String batchTagCollection;
    String lastBatchTagField;
    String sentKeysField;

    public FirestoreRepository(Firestore firestore, Properties properties) {
        this.firestore = firestore;
        this.batchTagCollection = properties.getDownloader().getDb().getCollections().getBatchTag();
        this.lastBatchTagField = properties.getDownloader().getDb().getLastBatchTagField();
        this.sentKeysField =  properties.getDownloader().getDb().getSentKeysField();
    }

    @SneakyThrows
    @Override
    public void saveLastBatchTag(LocalDate date, String lastBatchTag, int sentKeys) {
        String documentId = date.toString();

        DocumentReference docRef = firestore.collection(batchTagCollection).document(documentId);
        Map<String, Object> data = new HashMap<>();
        data.put(lastBatchTagField, lastBatchTag);
        data.put(sentKeysField, sentKeys);
        ApiFuture<WriteResult> result = docRef.set(data);
        result.get();
    }

    @SneakyThrows
    @Override
    public LastProcessedBatchTag fetchLastProcessedBatchTag(LocalDate date) {
        String documentId = date.toString();

        DocumentSnapshot processedBatchTags = firestore.collection(batchTagCollection)
                .document(documentId)
                .get()
                .get();

        Long sentKeys = (Long)processedBatchTags.get(sentKeysField);

        int offset = 0;
        if (sentKeys != null) {
            offset = sentKeys.intValue();
        }

        return new LastProcessedBatchTag(
            (String)processedBatchTags.get(lastBatchTagField),
            offset
        );
    }
}
