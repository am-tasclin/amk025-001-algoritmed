package org.algoritmed.amk025;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:config-app-spring.xml")
public class Amk025001AlgoritmedApplication {

	public static void main(String[] args) {
		SpringApplication.run(Amk025001AlgoritmedApplication.class, args);
	}

}

