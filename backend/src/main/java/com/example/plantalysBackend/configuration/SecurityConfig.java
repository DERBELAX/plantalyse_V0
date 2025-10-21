package com.example.plantalysBackend.configuration;

import com.example.plantalysBackend.security.CustomOAuth2SuccessHandler;
import com.example.plantalysBackend.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Profile;

import java.util.List;
@Profile("!test")
@Configuration
public class SecurityConfig {

    @Autowired
    private CustomOAuth2SuccessHandler oAuth2SuccessHandler;

    // CORS global configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://localhost:3001",
            "https://plantalys.com"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Main Spring Security filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers
                    .frameOptions().sameOrigin()
                    .httpStrictTransportSecurity()
                        .includeSubDomains(true)
                        .maxAgeInSeconds(31536000)
                )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json; charset=UTF-8");
                    response.getWriter().write("{\"error\": \"Non autorisé\"}");
                })
            .and()
            .authorizeHttpRequests(auth -> auth
                // Routes publiques
                .requestMatchers("/", "/api/auth/**", "/oauth2/**").permitAll()
                .requestMatchers("/api/community/posts", "/api/community/posts/**").permitAll()
                .requestMatchers("/api/plants/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/blogs/**").permitAll()
                .requestMatchers("/api/contact").permitAll()
                .requestMatchers("/api/reviews/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/identify**").permitAll()

                // Routes protégées
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/community/comments", "/api/community/comments/**").hasRole("USER")
                .requestMatchers("/api/community/likes", "/api/community/likes/**").hasRole("USER")
                .requestMatchers("/api/community/**").hasRole("USER")
                .requestMatchers("/api/orders/from-cart").hasRole("USER")
                .requestMatchers("/api/orders/**").permitAll()
                .requestMatchers("/api/payment/**").hasRole("USER")
                .requestMatchers("/api/paypal/**").hasRole("USER")

                // Tout le reste est protégé
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // Encoder pour les mots de passe
    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthManager pour les contrôleurs
    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Gestion des fichiers statiques
    @Configuration
    public static class WebMvcConfig implements WebMvcConfigurer {

        @Value("${upload.path}")
        private String uploadPath;

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
        }
    }
}
