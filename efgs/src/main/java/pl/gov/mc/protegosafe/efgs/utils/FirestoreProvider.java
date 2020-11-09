package pl.gov.mc.protegosafe.efgs.utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FirestoreProvider {

    @SneakyThrows
    public static Firestore provideFirestore() {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId("protego-fb-dev")
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
        return firestoreOptions.getService();
    }
}
