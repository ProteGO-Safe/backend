package pl.gov.mc.protegosafe.efgs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.function.Function;

@SpringBootApplication
public class EfgsDownloader {

	@Autowired Facade facade;

	public static void main(String[] args) {
		SpringApplication.run(EfgsDownloader.class, args);
	}

	@Bean
	public Function<String, String> uppercase() {
		return value -> facade.process(LocalDate.parse(value));
	}
}