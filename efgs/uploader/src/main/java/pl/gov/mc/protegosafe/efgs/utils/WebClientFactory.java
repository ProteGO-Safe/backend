package pl.gov.mc.protegosafe.efgs.utils;

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
public class WebClientFactory {

    String nbtlsLocation;

    @Autowired
    WebClientFactory(Properties properties) {
        this.nbtlsLocation = properties.getNbtlsLocation();
    }

    public static final String ACCEPT_HEADER_JSON = "application/json; version=1.0";
    public static final String ACCEPT_HEADER_PROTOBUF = "application/protobuf; version=1.0";

    @SneakyThrows
    public WebClient createWebClient() {

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
            // configure timeout for connection
            tcpClient = tcpClient.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000);

            // configure timeout for answer
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

    private static ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
            return Mono.just(clientRequest);
        });
    }
}
