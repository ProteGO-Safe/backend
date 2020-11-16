package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gov.mc.protegosafe.efgs.utils.WebClientFactory;

import java.net.URI;

import static java.lang.String.format;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_JSON;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.ACCEPT_HEADER_PROTOBUF;


@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class HttpUploader {

    WebClientFactory webClientFactory;
    String efgsApiUrl;

    HttpUploader(WebClientFactory webClientFactory, Properties properties) {
        this.webClientFactory = webClientFactory;
        this.efgsApiUrl = properties.getEfgsApiUrl();
    }

    boolean uploadDiagnosisKeyBatch(EfgsProto.DiagnosisKeyBatch batch, String uploaderBatchTag, String batchSignature) {
        try {
            makeCall(batch, uploaderBatchTag, batchSignature);
        } catch (WebClientResponseException e) {
            log.error(format("Error during uploading diagnosis keys. Code: %s, Message: %s", e.getStatusCode(), e.getResponseBodyAsString()), e);
            return false;
        }
        return true;
    }

    private void makeCall(EfgsProto.DiagnosisKeyBatch batch, String uploaderBatchTag, String batchSignature) {
        URI uri = UriComponentsBuilder.fromHttpUrl(efgsApiUrl)
                .pathSegment("upload")
                .build()
                .toUri();

        webClientFactory.createWebClient().post()
                .uri(uri)
                .headers(headers -> {
                    headers.set(HttpHeaders.ACCEPT, ACCEPT_HEADER_JSON);
                    headers.set(HttpHeaders.CONTENT_TYPE, ACCEPT_HEADER_PROTOBUF);
                    headers.set("batchSignature", batchSignature);
                    headers.set("batchTag", uploaderBatchTag);
                })
                .bodyValue(batch.toByteArray())
                .retrieve()
                .toEntity(String.class)
                .block();
    }
}
