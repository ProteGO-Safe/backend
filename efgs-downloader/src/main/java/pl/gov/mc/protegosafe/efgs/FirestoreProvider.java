package pl.gov.mc.protegosafe.efgs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
class FirestoreProvider {

    @SneakyThrows
    void provideFirestore() {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId("protego-fb-dev")
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
        Firestore service = firestoreOptions.getService();

        Map<String, Object> data = new HashMap<>();
        data.put("batchTag", "lastBatchTag");

        service.collection("processedBatchTags")
                .document("123")
                .set(data)
                .get();
    }
}
