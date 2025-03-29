package com.example.webgame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebgameApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebgameApplication.class, args);
	}

}
