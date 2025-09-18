package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.ForgotPasswordRequest;
import com.example.plantalysBackend.dto.ResetPasswordRequest;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.UserRepository;
import com.example.plantalysBackend.security.JwtTokenUtil;
import com.example.plantalysBackend.service.UserService;
import com.example.plantalysBackend.utils.XssSanitizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private XssSanitizer xssSanitizer;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtTokenUtil jwtTokenUtil;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private UserService userService;

    // INSCRIPTION

    @PostMapping("/signup")
    public User registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email déjà utilisé.");
        }

        user.setFirstname(xssSanitizer.sanitize(user.getFirstname()));
        user.setLastname(xssSanitizer.sanitize(user.getLastname()));
        user.setEmail(xssSanitizer.sanitize(user.getEmail()));

        String rawRole = (user.getRoles() != null && !user.getRoles().isBlank())
                ? user.getRoles().replace("ROLE_", "")
                : "USER";

        // Validation stricte du rôle
        if (!rawRole.equals("USER") && !rawRole.equals("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rôle non autorisé.");
        }

        user.setRoles(xssSanitizer.sanitize(rawRole));
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }


    // CONNEXION
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> payload) {
        String email = xssSanitizer.sanitize(payload.get("email"));
        String password = payload.get("password");

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe invalide");
        }

        String token = jwtTokenUtil.generateToken(user);
        return Map.of(
        	    "token", token,
        	    "userId", String.valueOf(user.getId_user())
        	);

    }

    // UTILISATEUR CONNECTÉ
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
        }

        String email = authentication.getName();


        if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User oauthUser) {
            email = oauthUser.getAttribute("email");
        }

        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email non trouvé dans le token");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non trouvé"));

        user.setPassword(null); // Jamais renvoyer le mot de passe
        return ResponseEntity.ok(user);
    }

    // DEMANDE DE RÉINITIALISATION DE MOT DE PASSE
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.sendResetEmail(request.getEmail());
        return ResponseEntity.ok("Email envoyé");
    }

    // APPLICATION DU NOUVEAU MOT DE PASSE
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Mot de passe réinitialisé");
    }
}
