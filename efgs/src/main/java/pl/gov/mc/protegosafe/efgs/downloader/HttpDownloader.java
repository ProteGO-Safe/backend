package pl.gov.mc.protegosafe.efgs.downloader;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import eu.interop.federationgateway.model.EfgsProto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gov.mc.protegosafe.efgs.utils.WebClientFactory;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_EFGS_URL;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_JSON;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_PROTOBUF;


@Slf4j
class HttpDownloader {

    @SneakyThrows
    static List<String> downloadAllDiagnosisKeyBatchesForDate(LocalDate date, String batchTag) {
        List<String> diagnosisKeyBatches = new ArrayList<>();
        ProtobufConverter protobufConverter = new ProtobufConverter();

        while (true) {
            URI uri = UriComponentsBuilder.fromHttpUrl(System.getenv(ENV_EFGS_URL))
                    .pathSegment("download")
                    .pathSegment(date.format(DateTimeFormatter.ISO_DATE))
                    .build()
                    .toUri();

            final String fixedBatchTag = batchTag;

            final ResponseEntity<ByteArrayResource> response = WebClientFactory.createWebClient().get()
                    .uri(uri)
                    .headers(headers -> {
                        headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_PROTOBUF);
                        headers.set("batchTag", fixedBatchTag);
                    })
                    .retrieve()
                    .toEntity(ByteArrayResource.class)
                    .block();

            batchTag = response.getHeaders().getFirst("batchTag");
            if (response.getBody() == null) {
                log.info("No batches added for batchTag: {}", batchTag);
            } else {

                EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch =
                        EfgsProto.DiagnosisKeyBatch.parseFrom(response.getBody().getByteArray());
                String efgsSimulatorDownloadResult = protobufConverter.printToString(diagnosisKeyBatch);

                List<AuditEntry> auditEntries = callAuditDownload(batchTag, date);
                if (validateDiagnosisKeyWithSignature(diagnosisKeyBatch, auditEntries)) {
                    log.info("Successfully validated batch signature for batchTag {}.", batchTag);
                    diagnosisKeyBatches.add(efgsSimulatorDownloadResult);
                } else {
                    log.info("The validation of the signature failed for batchTag: {}.", batchTag);
                }
            }

            String nextBatchTagHeader = response.getHeaders().getFirst("nextBatchTag");
            if (nextBatchTagHeader.equals("null")) {
                break;
            }

            batchTag = nextBatchTagHeader;

        }
        return diagnosisKeyBatches;
    }

    @SneakyThrows
    private static List<AuditEntry> callAuditDownload(String batchTag, LocalDate date) {

        URI uri = UriComponentsBuilder.fromHttpUrl(System.getenv(ENV_EFGS_URL))
                .pathSegment("audit")
                .pathSegment("download")
                .pathSegment(date.toString())
                .pathSegment(batchTag).build()
                .toUri();

        log.info("Start calling audit-download for batchTag: {}", batchTag);
        ResponseEntity<String> response = WebClientFactory.createWebClient().get()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_JSON);
                })
                .retrieve()
                .toEntity(String.class)
                .block();

        log.info("Stop calling audit-download for batchTag: {}", batchTag);

        return createObjectMapper().readValue(response.getBody(), new TypeReference<>() {
        });
    }

    private static ObjectMapper createObjectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private static boolean validateDiagnosisKeyWithSignature(EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch,
                                                             List<AuditEntry> auditEntries) {
        for (AuditEntry auditEntry : auditEntries) {
            if (BatchSignatureVerifier.verify(diagnosisKeyBatch, auditEntry.getBatchSignature())) {
                return true;
            }
        }
        return false;
    }
}
