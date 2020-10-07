package pl.gov.mc.protegosafe.efgs.downloader;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.Lists;
import lombok.SneakyThrows;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static pl.gov.mc.protegosafe.efgs.Constants.PROCESSED_BATCH_TAGS_COLLECTION;
import static pl.gov.mc.protegosafe.efgs.downloader.FirestoreProvider.FIRESTORE;

class DownloaderFacade {

    static void process(LocalDate date) {
        String lastProcessedBatchTag = fetchLastProcessedBatchTag(date);
        String batchTag = HttpDownloader.fetchNextBatchTag(date, lastProcessedBatchTag);

        List<ProcessedDownloadedDiagnosisKeyBatches> responses = Lists.newArrayList();

        DownloaderService.process(responses, date, batchTag);

        responses.stream()
                .max(ProcessedDownloadedDiagnosisKeyBatches::compareTo)
                .map(ProcessedDownloadedDiagnosisKeyBatches::getBatchTag)
                .ifPresent(lastBatchTag -> processResponses(responses, date, lastBatchTag));
    }

    @SneakyThrows
    private static void processResponses(List<ProcessedDownloadedDiagnosisKeyBatches> responses, LocalDate date, String lastBatchTag) {

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(responses);
        MessageSender.publishMessage(json);

        saveLastBatchTag(date, lastBatchTag);
    }

    @SneakyThrows
    private static void saveLastBatchTag(LocalDate date, String lastBatchTag) {
        String documentId = date.toString();

        DocumentReference docRef = FIRESTORE.collection(PROCESSED_BATCH_TAGS_COLLECTION).document(documentId);
        Map<String, Object> data = new HashMap<>();
        data.put("batchTag", lastBatchTag);
        ApiFuture<WriteResult> result = docRef.set(data);
        result.get();
    }

    @SneakyThrows
    private static String fetchLastProcessedBatchTag(LocalDate date) {
        String documentId = date.toString();

        DocumentSnapshot processedBatchTags = FIRESTORE.collection(PROCESSED_BATCH_TAGS_COLLECTION)
                .document(documentId)
                .get()
                .get();

        return (String) processedBatchTags.get("batchTag");
    }
}
