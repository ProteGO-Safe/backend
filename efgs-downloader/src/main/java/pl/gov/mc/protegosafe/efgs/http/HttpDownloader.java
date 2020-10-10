package pl.gov.mc.protegosafe.efgs.http;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.Lists;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gov.mc.protegosafe.efgs.Properties;

import javax.annotation.Nullable;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static pl.gov.mc.protegosafe.efgs.http.WebClientFactory.ACCEPT_HEADER_PROTOBUF;


@Slf4j
@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class HttpDownloader implements HttpConnector {

    WebClientFactory webClientFactory;
    Properties properties;

    @SneakyThrows
    @Override
    public BatchesResponse fetchBatches(LocalDate date, final String batchTag) {

        @Nullable ResponseEntity<ByteArrayResource> response = fetchDiagnosisKeysResponse(batchTag, date);

        @Nullable String nextBatchTag = obtainHeaderValue(response, "nextBatchTag");
        return new BatchesResponse(
                resolveBatchTag(batchTag, response),
                resolveNextBatchTag(nextBatchTag),
                obtainBody(response)
        );
    }

    @Override
    public String fetchNextBatchTag(LocalDate date, final String batchTag) {
        @Nullable ResponseEntity<ByteArrayResource> response = fetchDiagnosisKeysResponse(batchTag, date);
        return obtainHeaderValue(response, "nextBatchTag");
    }

    @Override
    public List<AuditResponse> listAudits(String batchTag, LocalDate date) {
        URI uri = UriComponentsBuilder.fromHttpUrl(properties.getApi())
                .pathSegment("audit")
                .pathSegment("download")
                .pathSegment(date.toString())
                .pathSegment(batchTag).build()
                .toUri();

        ResponseEntity<String> response = webClientFactory.createWebClient().get()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, WebClientFactory.ACCEPT_HEADER_JSON);
                })
                .retrieve()
                .toEntity(String.class)
                .block();

        return Optional.ofNullable(response)
                .map(HttpEntity::getBody)
                .map(this::readValue)
                .orElseGet(Lists::newArrayList);
    }

    private String resolveNextBatchTag(String nextBatchTag) {
        if ("null".equals(nextBatchTag)) {
            return null;
        }
        return nextBatchTag;
    }

    private ByteArrayResource obtainBody(@Nullable ResponseEntity<ByteArrayResource> response) {
        return Optional.ofNullable(response)
                .map(HttpEntity::getBody)
                .orElse(null);
    }

    private ResponseEntity<ByteArrayResource> fetchDiagnosisKeysResponse(String batchTag, LocalDate date) {

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

    private ResponseEntity<ByteArrayResource> connect(String batchTag, URI uri) {
        return webClientFactory.createWebClient().get()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_PROTOBUF);
                    headers.set("batchTag", batchTag);
                })
                .retrieve()
                .toEntity(ByteArrayResource.class)
                .block();
    }

    private URI prepareUri(LocalDate date) {
        return UriComponentsBuilder.fromHttpUrl(properties.getApi())
                .pathSegment("download")
                .pathSegment(date.format(DateTimeFormatter.ISO_DATE))
                .build()
                .toUri();
    }

    private String obtainHeaderValue(@Nullable ResponseEntity<ByteArrayResource> response, String header) {
        return Optional.ofNullable(response)
                .map(HttpEntity::getHeaders)
                .map(httpHeaders -> httpHeaders.getFirst(header))
                .orElse(null);
    }

    private String resolveBatchTag(String batchTag, ResponseEntity<ByteArrayResource> response) {

        if (batchTag != null) {
            return batchTag;
        }

        return obtainHeaderValue(response, "batchTag");
    }

    @SneakyThrows
    private List<AuditResponse> readValue(String content) {
        return createObjectMapper().readValue(content, new TypeReference<>() {
        });
    }

    private static ObjectMapper createObjectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
}
