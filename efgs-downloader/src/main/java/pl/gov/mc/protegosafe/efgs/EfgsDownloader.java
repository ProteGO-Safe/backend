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
public class EfgsDownloader {

	@Autowired
	EfgsKeysProcessor efgsKeysProcessor;

	public static void main(String[] args) {
		SpringApplication.run(EfgsDownloader.class, args);
	}

	@Bean
	public Consumer<TriggerEvent> process() {
		return value -> efgsKeysProcessor.process();
	}
}
