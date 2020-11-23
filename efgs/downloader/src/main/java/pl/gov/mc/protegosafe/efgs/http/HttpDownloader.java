package pl.gov.mc.protegosafe.efgs.http;

import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gov.mc.protegosafe.efgs.Properties;

import javax.annotation.Nullable;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import static com.google.common.collect.ImmutableList.of;
import static org.springframework.http.HttpStatus.GONE;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static pl.gov.mc.protegosafe.efgs.http.WebClientFactory.ACCEPT_HEADER_JSON;


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

    private BatchesResponse createBatchesResponse(ClientResponse response) {
        @Nullable String nextBatchTag = obtainHeaderValue(response, "nextBatchTag");
        return new BatchesResponse(
                resolveBatchTag(response),
                resolveNextBatchTag(nextBatchTag),
                obtainBody(response));
    }

    private String resolveNextBatchTag(String nextBatchTag) {
        if ("null".equals(nextBatchTag)) {
            return null;
        }
        return nextBatchTag;
    }

    private String obtainBody(@Nullable ClientResponse response) {
        return Optional.ofNullable(response)
                .map(clientResponse -> clientResponse.bodyToMono(String.class).block())
                .orElse(null);
    }

    private Optional<ClientResponse> fetchDiagnosisKeysResponse(String batchTag, LocalDate date) {

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

    private ClientResponse connect(String batchTag, URI uri) {
        return webClientFactory.createWebClient().get()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_JSON);
                    headers.set("batchTag", batchTag);
                })
                .exchange()
                .block();
    }

    private URI prepareUri(LocalDate date) {
        return UriComponentsBuilder.fromHttpUrl(api)
                .pathSegment("download")
                .pathSegment(date.format(DateTimeFormatter.ISO_DATE))
                .build()
                .toUri();
    }

    private String obtainHeaderValue(ClientResponse response, String header) {
        return response.headers()
                .asHttpHeaders()
                .getFirst(header);
    }

    private String resolveBatchTag(ClientResponse response) {
        return obtainHeaderValue(response, "batchTag");
    }
}
