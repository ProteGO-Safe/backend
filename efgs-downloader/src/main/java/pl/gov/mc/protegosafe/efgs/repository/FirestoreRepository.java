package pl.gov.mc.protegosafe.efgs.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Repository;
import pl.gov.mc.protegosafe.efgs.Properties;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Repository
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class FirestoreRepository implements BatchTagRepository {

    Firestore firestore;
    Properties properties;

    @SneakyThrows
    @Override
    public void saveLastBatchTag(LocalDate date, String lastBatchTag) {
        String documentId = date.toString();

        String batchTagCollection = properties.getDownloader().getDb().getCollections().getBatchTag();
        DocumentReference docRef = firestore.collection(batchTagCollection).document(documentId);
        Map<String, Object> data = new HashMap<>();
        data.put(properties.getDownloader().getDb().getLastBatchTagField(), lastBatchTag);
        ApiFuture<WriteResult> result = docRef.set(data);
        result.get();

    }

    @SneakyThrows
    @Override
    public String fetchLastProcessedBatchTag(LocalDate date) {
        String documentId = date.toString();
        String batchTagCollection = properties.getDownloader().getDb().getCollections().getBatchTag();

        DocumentSnapshot processedBatchTags = firestore.collection(batchTagCollection)
                .document(documentId)
                .get()
                .get();

        return (String) processedBatchTags.get(properties.getDownloader().getDb().getLastBatchTagField());
    }
}
