package com.example.plantalysBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest(
        classes = PlantalysBackendApplicationTests.TestConfig.class,
        webEnvironment = SpringBootTest.WebEnvironment.NONE
)
class PlantalysBackendApplicationTests {

    @SpringBootConfiguration
    @EnableAutoConfiguration(exclude = {
            OAuth2ClientAutoConfiguration.class,
            OAuth2ResourceServerAutoConfiguration.class,
            MailSenderAutoConfiguration.class
    })
    @ComponentScan(
            basePackages = "com.example.plantalysBackend",
            excludeFilters = @ComponentScan.Filter(
                    type = FilterType.REGEX,
                    pattern = "com\\.example\\.plantalysBackend\\.configuration\\..*"
            )
    )
    static class TestConfig { }

    @Test
    void contextLoads() { }
}
