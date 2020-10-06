package pl.gov.mc.protegosafe.efgs.uploader;

import eu.interop.federationgateway.model.EfgsProto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_EFGS_URL;
import static pl.gov.mc.protegosafe.efgs.utils.WebClientFactory.*;


@Slf4j
class HttpUploader {

    static void uploadDiagnosisKeyBatch(EfgsProto.DiagnosisKeyBatch batch, String uploaderBatchTag, String batchSignature) {

        URI uri = UriComponentsBuilder.fromHttpUrl(System.getenv(ENV_EFGS_URL))
                .pathSegment("upload")
                .build()
                .toUri();

        createWebClient().post()
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
