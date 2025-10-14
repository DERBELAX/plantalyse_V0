package com.example.plantalysBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.example.plantalysBackend.security.CustomOAuth2SuccessHandler;
import com.example.plantalysBackend.security.JwtTokenUtil;

@ActiveProfiles("test")
@SpringBootTest
class PlantalysBackendApplicationTests {

    @MockBean
    private CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @Test
    void contextLoads() { }
}

