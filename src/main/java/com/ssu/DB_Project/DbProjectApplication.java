package com.ssu.DB_Project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class DbProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(DbProjectApplication.class, args);
	}
}