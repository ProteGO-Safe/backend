package pl.gov.mc.protegosafe.efgs.utils;

import io.netty.channel.ChannelOption;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_NBTLS_LOCATION;

@Slf4j
public class WebClientFactory {

    public static final String ACCEPT_HEADER_JSON = "application/json; version=1.0";
    public static final String ACCEPT_HEADER_PROTOBUF = "application/protobuf; version=1.0";

    @SneakyThrows
    public static WebClient createWebClient() {

        PrivateKey privateKey = CertUtils.loadPrivateKeyFromFile(ENV_NBTLS_LOCATION);
        X509Certificate certificate = CertUtils.loadCertificateFromFile(ENV_NBTLS_LOCATION);

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
