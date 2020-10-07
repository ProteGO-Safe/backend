package pl.gov.mc.protegosafe.efgs;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.Lists;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class Facade {

    HttpDownloader httpDownloader;
    DownloaderService downloaderService;
    FirestoreProvider firestoreProvider;
    MessageSender messageSender;

    String process(LocalDate date) {
        String lastProcessedBatchTag = fetchLastProcessedBatchTag(date);
        String batchTag = httpDownloader.fetchNextBatchTag(date, lastProcessedBatchTag);

        List<ProcessedDownloadedDiagnosisKeyBatches> responses = Lists.newArrayList();

        downloaderService.process(responses, date, batchTag);

        responses.stream()
                .max(ProcessedDownloadedDiagnosisKeyBatches::compareTo)
                .map(ProcessedDownloadedDiagnosisKeyBatches::getBatchTag)
                .ifPresent(lastBatchTag -> processResponses(responses, date, lastBatchTag));
        return "";
    }

    @SneakyThrows
    private void processResponses(List<ProcessedDownloadedDiagnosisKeyBatches> responses, LocalDate date, String lastBatchTag) {

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(responses);
        messageSender.publishMessage(json);

        saveLastBatchTag(date, lastBatchTag);
    }

    @SneakyThrows
    private void saveLastBatchTag(LocalDate date, String lastBatchTag) {
        String documentId = date.toString();

        DocumentReference docRef = firestoreProvider.provideFirestore().collection("processedBatchTags").document(documentId);
        Map<String, Object> data = new HashMap<>();
        data.put("batchTag", lastBatchTag);
        ApiFuture<WriteResult> result = docRef.set(data);
        result.get();
    }

    @SneakyThrows
    private String fetchLastProcessedBatchTag(LocalDate date) {
        String documentId = date.toString();

        DocumentSnapshot processedBatchTags = firestoreProvider.provideFirestore().collection("processedBatchTags")
                .document(documentId)
                .get()
                .get();

        return (String) processedBatchTags.get("batchTag");
    }
}
