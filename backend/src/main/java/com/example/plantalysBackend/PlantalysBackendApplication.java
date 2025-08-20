package com.example.plantalysBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling //Activer les @Scheduled

public class PlantalysBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlantalysBackendApplication.class, args);
	}

}
