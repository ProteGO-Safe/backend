package pl.gov.mc.protegosafe.efgs.utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_PROJECT_ID;

@Slf4j
public class FirestoreProvider {

    @SneakyThrows
    public static Firestore provideFirestore() {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId(ENV_PROJECT_ID)
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
        return firestoreOptions.getService();
    }
}
