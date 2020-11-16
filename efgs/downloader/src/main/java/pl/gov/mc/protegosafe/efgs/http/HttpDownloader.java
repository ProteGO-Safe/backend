package pl.gov.mc.protegosafe.efgs.http;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.Lists;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
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

import static com.google.common.collect.ImmutableList.of;
import static org.springframework.http.HttpStatus.GONE;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static pl.gov.mc.protegosafe.efgs.http.WebClientFactory.ACCEPT_HEADER_PROTOBUF;


@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class HttpDownloader implements HttpConnector {

    WebClientFactory webClientFactory;
    String api;

    HttpDownloader(WebClientFactory webClientFactory, Properties properties) {
        this.webClientFactory = webClientFactory;
        this.api = properties.getApi();
    }

    @SneakyThrows
    @Override
    public Optional<BatchesResponse> fetchBatches(LocalDate date, final String batchTag) {

        return fetchDiagnosisKeysResponse(batchTag, date)
                .map(this::createBatchesResponse);
    }

    private BatchesResponse createBatchesResponse(ResponseEntity<ByteArrayResource> response) {
        @Nullable String nextBatchTag = obtainHeaderValue(response, "nextBatchTag");
        return new BatchesResponse(
                resolveBatchTag(response),
                resolveNextBatchTag(nextBatchTag),
                obtainBody(response));
    }

    @Override
    public List<AuditResponse> listAudits(String batchTag, LocalDate date) {
        URI uri = UriComponentsBuilder.fromHttpUrl(api)
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

    private Optional<ResponseEntity<ByteArrayResource>> fetchDiagnosisKeysResponse(String batchTag, LocalDate date) {

        URI uri = prepareUri(date);

        try {
            return Optional.of(connect(batchTag, uri));
        } catch (WebClientResponseException e) {
            if (of(NOT_FOUND, GONE).contains(e.getStatusCode())) {
                return Optional.empty();
            }
            log.error("Error during downloading keys", e);
            throw new IllegalStateException(e);
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
        return UriComponentsBuilder.fromHttpUrl(api)
                .pathSegment("download")
                .pathSegment(date.format(DateTimeFormatter.ISO_DATE))
                .build()
                .toUri();
    }

    private String obtainHeaderValue(ResponseEntity<ByteArrayResource> response, String header) {
        return response.getHeaders()
                .getFirst(header);
    }

    private String resolveBatchTag(ResponseEntity<ByteArrayResource> response) {
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
