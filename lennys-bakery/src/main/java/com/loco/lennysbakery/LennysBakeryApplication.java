package com.loco.lennysbakery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class LennysBakeryApplication {

	public static void main(String[] args) {
		SpringApplication.run(LennysBakeryApplication.class, args);
	}

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}
}
