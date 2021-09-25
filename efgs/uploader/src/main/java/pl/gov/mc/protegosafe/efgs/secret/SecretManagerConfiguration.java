package pl.gov.mc.protegosafe.efgs.secret;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.secretmanager.v1.AccessSecretVersionResponse;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.gov.mc.protegosafe.efgs.Properties;

@Configuration
class SecretManagerConfiguration {

    @Autowired
    Properties properties;

    @SneakyThrows
    @Bean
    CloudBackendConfig cloudBackendConfig() {
        try (SecretManagerServiceClient client = SecretManagerServiceClient.create()) {

            SecretVersionName secretVersionName = SecretVersionName.of(properties.getProjectId(), "cloud-backend-config", "latest");

            AccessSecretVersionResponse response = client.accessSecretVersion(secretVersionName);
            String payload = response.getPayload().getData().toStringUtf8();

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return objectMapper.readValue(payload, CloudBackendConfig.class);
        }
    }
}
