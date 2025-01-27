package com.loco;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.loco.model")    // Replace with your package containing entities
@EnableJpaRepositories(basePackages = "com.loco.repository") // Replace with your repositories
public class PersistenceConfig {
}