package com.example.plantalysBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

// ⚠️ Assure-toi que ces imports/chemins correspondent bien à ton projet
import com.example.plantalysBackend.security.CustomOAuth2SuccessHandler;
import com.example.plantalysBackend.security.JwtTokenUtil;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
    // Au cas où des auto-configs s’initialisent quand même
    "spring.autoconfigure.exclude="
        + "org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration,"
        + "org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration,"
        + "org.springframework.boot.autoconfigure.oauth2.client.servlet.OAuth2ClientAutoConfiguration",
    // Datasource H2 (si la conf test n’est pas lue)
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false",
    "spring.liquibase.enabled=false"
})
class PlantalysBackendApplicationTests {

  
    @MockBean
    private CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @Test
    void contextLoads() { }
}
