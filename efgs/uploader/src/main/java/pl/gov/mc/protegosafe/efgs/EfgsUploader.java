package pl.gov.mc.protegosafe.efgs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import java.util.function.Consumer;

@SpringBootApplication
@Slf4j
@EnableConfigurationProperties(Properties.class)
public class EfgsUploader {

	@Autowired
	EfgsDiagnosisKeysUploader efgsDiagnosisKeysUploader;

	public static void main(String[] args) {
		SpringApplication.run(EfgsUploader.class, args);
	}

	@Bean
	public Consumer<String> process() {
		return value -> efgsDiagnosisKeysUploader.process();
	}
}
