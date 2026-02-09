package com.b2fy.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class B2fyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(B2fyBackendApplication.class, args);
    }
}
