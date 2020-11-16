package pl.gov.mc.protegosafe.efgs.http;

import io.netty.channel.ChannelOption;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import pl.gov.mc.protegosafe.efgs.Properties;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class WebClientFactory {

    static final String ACCEPT_HEADER_JSON = "application/json; version=1.0";
    static final String ACCEPT_HEADER_PROTOBUF = "application/protobuf; version=1.0";

    String nbtlsLocation;

    @Autowired
    WebClientFactory(Properties properties) {
        this.nbtlsLocation = properties.getDownloader().getCerts().getNbtlsLocation();
    }

    @SneakyThrows
    WebClient createWebClient() {

        PrivateKey privateKey = CertUtils.loadPrivateKeyFromFile(nbtlsLocation);
        X509Certificate certificate = CertUtils.loadCertificateFromFile(nbtlsLocation);

        HttpClient httpClient = HttpClient.create();

        SslContextBuilder sslContextBuilder = SslContextBuilder
                .forClient()
                .enableOcsp(false)
                .keyManager(new ForceCertUsageX509KeyManager(privateKey, certificate));

        SslContext sslContext = sslContextBuilder.build();
        httpClient = httpClient.secure(sslContextSpec -> sslContextSpec.sslContext(sslContext));

        httpClient = httpClient.tcpConfiguration(tcpClient -> {
            tcpClient = tcpClient.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000);
            tcpClient = tcpClient.doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(30000, TimeUnit.MILLISECONDS)));

            return tcpClient;
        });

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .filters(exchangeFilterFunctions -> {
                    exchangeFilterFunctions.add(logRequest());
                })
                .build();
    }

    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
            clientRequest.headers().forEach((name, values) -> values.forEach(value -> log.info("{}={}", name, value)));
            return Mono.just(clientRequest);
        });
    }
}
