package com.campuscart.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module; // Ensure this matches your Hibernate version (hibernate6 for Spring Boot 3)
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Module hibernate6Module() {
        // Explicitly create and register the Hibernate module for Jackson
        Hibernate6Module module = new Hibernate6Module();
        // Optional: Configure features if needed, e.g., prevent force loading lazy associations
        // module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false);
        return module;
    }
}