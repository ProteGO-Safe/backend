package pl.gov.mc.protegosafe.efgs.downloader;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import lombok.SneakyThrows;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_PROJECT_ID;

class FirestoreProvider {

    static final Firestore FIRESTORE = provideFirestore();

    @SneakyThrows
    private static synchronized Firestore provideFirestore() {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId(ENV_PROJECT_ID)
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
        return firestoreOptions.getService();
    }
}
