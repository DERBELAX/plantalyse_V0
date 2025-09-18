package com.example.plantalysBackend.security;

import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @Value("${app.frontend.redirect-uri}")
    private String frontendRedirectUri;

    public CustomOAuth2SuccessHandler(UserRepository userRepository, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String[] parts = name != null ? name.split(" ", 2) : new String[]{"Utilisateur", ""};
        String firstname = parts[0];
        String lastname = parts.length > 1 ? parts[1] : "";

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstname(firstname);
            newUser.setLastname(lastname);
            newUser.setRoles("USER"); // 👈 ici on garde "USER" simple, pas "ROLE_USER"
            newUser.setPassword("");  // Aucun mot de passe pour OAuth
            newUser.setOauthUser(true);
            return userRepository.save(newUser);
        });

        String jwtToken = jwtTokenUtil.generateToken(user);

        // Redirection vers le frontend avec le JWT (si tu veux l’injecter dans l’URL)
        String redirectUrl = frontendRedirectUri + "?token=" + URLEncoder.encode(jwtToken, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }
}
