package com.example.plantalysBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;

@ActiveProfiles("test")
@SpringBootTest(
    classes = PlantalysBackendApplicationTests.TestConfig.class,
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    properties = "spring.main.web-application-type=none"
)
class PlantalysBackendApplicationTests {

    @SpringBootConfiguration
    @EnableAutoConfiguration(exclude = {
            SecurityAutoConfiguration.class,
            SecurityFilterAutoConfiguration.class,
            UserDetailsServiceAutoConfiguration.class,
            OAuth2ClientAutoConfiguration.class,
            OAuth2ResourceServerAutoConfiguration.class,
            MailSenderAutoConfiguration.class
    })
    static class TestConfig {
       
    }

    @Test
    void contextLoads() { }
}
