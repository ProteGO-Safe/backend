package pl.gov.mc.protegosafe.efgs.uploader.repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import pl.gov.mc.protegosafe.efgs.uploader.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.uploader.model.ReportType;
import pl.gov.mc.protegosafe.efgs.uploader.repository.model.DiagnosisKeyModel;
import pl.gov.mc.protegosafe.efgs.utils.FirestoreProvider;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.google.common.collect.Lists.newArrayList;


@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class DiagnosisKeysRepository {

    static String COLLECTION_NAME = "diagnosisKeys";
    static int LIMIT = 1000;
    static int THREE_HOURS = 3 * 60 * 60;
    Firestore firestore;

    public DiagnosisKeysRepository() {
        this.firestore = FirestoreProvider.provideFirestore();
    }

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
                diagnosisKeyModel.getTransmissionRisk(),
                newArrayList(),
                "origin",
                ReportType.SELF_REPORT,
                DiagnosisKey.DAYS_SINCE_ONSET_OF_SYMPTOMS
        );
    }

    @SneakyThrows
    public void removeDocument(String documentId) {
        firestore.collection(COLLECTION_NAME).document(documentId).delete().get();
    }
}
