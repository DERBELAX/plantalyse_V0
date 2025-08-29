package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.UserRepository;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
    
    @PutMapping("/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(@RequestBody User updatedUser, Authentication authentication) {
        String email = authentication.getName();

        // On récupère l'utilisateur connecté
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mettre à jour uniquement les champs modifiables
        currentUser.setFirstname(updatedUser.getFirstname());
        currentUser.setLastname(updatedUser.getLastname());
        // Ne pas modifier l'email ici
        // Ne pas modifier les rôles ou autres champs sensibles

        userRepository.save(currentUser);

        return ResponseEntity.ok("Profil mis à jour avec succès.");
    }
    
    
    @PutMapping("/update-email-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateEmailAndPassword(@RequestBody Map<String, String> payload, Authentication auth) {
        String currentEmail = auth.getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String oldPassword = payload.get("oldPassword");
        String newEmail = payload.get("email");
        String newPassword = payload.get("password");

        if (oldPassword == null || !new BCryptPasswordEncoder().matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe actuel incorrect.");
        }

        if (newEmail != null && !newEmail.trim().isEmpty() && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body("Cet email est déjà utilisé.");
            }
            user.setEmail(newEmail);
        }

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            String hashed = new BCryptPasswordEncoder().encode(newPassword);
            user.setPassword(hashed);
        }

        userRepository.save(user);
        return ResponseEntity.ok("Email et/ou mot de passe mis à jour.");
    }


}
