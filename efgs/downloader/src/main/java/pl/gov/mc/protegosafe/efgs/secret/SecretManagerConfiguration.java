package pl.gov.mc.protegosafe.efgs.secret;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class SecretManagerConfiguration {

    @SneakyThrows
    @Bean
    CloudBackendConfig cloudBackendConfig(@Value("${sm://cloud-backend-config}") String cloudBackendConfig) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper.readValue(cloudBackendConfig, CloudBackendConfig.class);
    }
}
