package com.example.plantalysBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

// Exclusions sécurité
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;

// ⚠️ adapte ces imports à tes vrais packages/classes
import com.example.plantalysBackend.security.CustomOAuth2SuccessHandler;
import com.example.plantalysBackend.security.JwtTokenUtil;

@ActiveProfiles("test")
// ✅ On coupe TOUTE l’auto-config sécurité côté test
@EnableAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class,
        OAuth2ClientAutoConfiguration.class,
        OAuth2ResourceServerAutoConfiguration.class
})
@SpringBootTest
class PlantalysBackendApplicationTests {

    // ✅ On bouche les dépendances sécurité restantes
    @MockBean
    private CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @Test
    void contextLoads() { }
}
