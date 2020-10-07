package pl.gov.mc.protegosafe.efgs.downloader;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.Lists;
import eu.interop.federationgateway.model.EfgsProto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gov.mc.protegosafe.efgs.utils.WebClientFactory;

import javax.annotation.Nullable;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_EFGS_URL;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_JSON;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_PROTOBUF;


@Slf4j
class HttpDownloader {

    @SneakyThrows
    static DownloadedDiagnosisKeyBatchesResponse downloadDiagnosisKeyBatches(LocalDate date, final String batchTag) {

        @Nullable ResponseEntity<ByteArrayResource> response = fetchDiagnosisKeysResponse(batchTag, date);

        @Nullable String nextBatchTag = obtainHeaderValue(response, "nextBatchTag");
        return new DownloadedDiagnosisKeyBatchesResponse(
                resolveBatchTag(batchTag, response),
                resolveNextBatchTag(nextBatchTag),
                obtainBody(response)
        );
    }

    static String fetchNextBatchTag(LocalDate date, final String batchTag) {
        @Nullable ResponseEntity<ByteArrayResource> response = fetchDiagnosisKeysResponse(batchTag, date);
        return obtainHeaderValue(response, "nextBatchTag");
    }

    private static String resolveNextBatchTag(String nextBatchTag) {
        if ("null".equals(nextBatchTag)) {
            return null;
        }
        return nextBatchTag;
    }

    private static ByteArrayResource obtainBody(@Nullable ResponseEntity<ByteArrayResource> response) {
        return Optional.ofNullable(response)
                .map(HttpEntity::getBody)
                .orElse(null);
    }

    private static ResponseEntity<ByteArrayResource> fetchDiagnosisKeysResponse(String batchTag, LocalDate date) {

        URI uri = prepareUri(date);

        try {
            return connect(batchTag, uri);
        } catch (WebClientResponseException e) {
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                return null;
            } else {
                throw e;
            }
        }
    }

    private static ResponseEntity<ByteArrayResource> connect(String batchTag, URI uri) {
        return WebClientFactory.createWebClient().get()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_PROTOBUF);
                    headers.set("batchTag", batchTag);
                })
                .retrieve()
                .toEntity(ByteArrayResource.class)
                .block();
    }

    private static URI prepareUri(LocalDate date) {
        return UriComponentsBuilder.fromHttpUrl(ENV_EFGS_URL)
                .pathSegment("download")
                .pathSegment(date.format(DateTimeFormatter.ISO_DATE))
                .build()
                .toUri();
    }

    private static String obtainHeaderValue(@Nullable ResponseEntity<ByteArrayResource> response, String header) {
        return Optional.ofNullable(response)
                .map(HttpEntity::getHeaders)
                .map(httpHeaders -> httpHeaders.getFirst(header))
                .orElse(null);
    }

    private static String resolveBatchTag(String batchTag, ResponseEntity<ByteArrayResource> response) {

        if (batchTag != null) {
            return batchTag;
        }

        return obtainHeaderValue(response, "batchTag");
    }

    @SneakyThrows
    static List<AuditEntry> callAuditDownload(String batchTag, LocalDate date) {

        URI uri = UriComponentsBuilder.fromHttpUrl(ENV_EFGS_URL)
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

        return Optional.ofNullable(response)
                .map(HttpEntity::getBody)
                .map(HttpDownloader::readValue)
                .orElseGet(Lists::newArrayList);
    }

    @SneakyThrows
    private static List<AuditEntry> readValue(String content) {
        return createObjectMapper().readValue(content, new TypeReference<>() {
        });
    }

    private static ObjectMapper createObjectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    static boolean validateDiagnosisKeyWithSignature(EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch,
                                                     List<AuditEntry> auditEntries) {
        for (AuditEntry auditEntry : auditEntries) {
            if (BatchSignatureVerifier.verify(diagnosisKeyBatch, auditEntry.getBatchSignature())) {
                return true;
            }
        }
        return false;
    }
}
