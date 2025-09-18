package com.example.plantalysBackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.plantalysBackend.model.*;
import com.example.plantalysBackend.repository.*;
import com.example.plantalysBackend.utils.XssSanitizer;

import jakarta.transaction.Transactional;

import com.example.plantalysBackend.dto.UserDTO;

@Service
public class UserService {
	@Autowired private EmailService emailService;
    @Autowired private XssSanitizer xssSanitizer;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private OrderRepository orderRepository;
    @Autowired private PostCommunityRepository postCommunityRepository;
    @Autowired private LikeCommunityRepository likeCommunityRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private BlogRepository blogRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private WateringReminderRepository wateringReminderRepository;

    // Créer un utilisateur
    public User createUser(UserDTO dto) {
        User user = new User();
        user.setFirstname(xssSanitizer.sanitize(dto.getFirstname()));
        user.setLastname(xssSanitizer.sanitize(dto.getLastname()));
        user.setEmail(xssSanitizer.sanitize(dto.getEmail()));
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(xssSanitizer.sanitize(dto.getRoles()));
        return userRepository.save(user);
    }

    // Envoyer l’email de réinitialisation
    @Value("${frontend.reset.url:http://localhost:3001/reset-password}")
    private String frontendResetUrl;
    public void sendResetEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();
        //Vérifie que ce n’est pas un compte OAuth2
        if (user.isOauthUser()) {
            throw new RuntimeException("Impossible de réinitialiser le mot de passe pour un compte Google.");
        }

        //  Vérifie qu’un mot de passe existe (optionnel)
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Aucun mot de passe à réinitialiser.");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = frontendResetUrl + "?token=" + token;

        String message = "Bonjour " + user.getFirstname() + ",\n\n"
                + "Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :\n"
                + resetUrl + "\n\n"
                + "Ce lien expirera dans 15 minutes.\n\n"
                + "L’équipe Plantalys";

        emailService.sendPasswordResetEmail(
        	    user.getEmail(),
        	    resetUrl,
        	    user.getFirstname()
        	);

        System.out.println("Email de réinitialisation envoyé à : " + user.getEmail());
    }

    //  Réinitialiser le mot de passe
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Lien invalide ou expiré"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le lien a expiré");
        }

        User user = resetToken.getUser();
        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable");
        }

        if (!newPassword.matches("^(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }

    // Récupérer, mettre à jour ou supprimer des utilisateurs (inchangé)
    public List<User> getAllUsers() { return userRepository.findAll(); }
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public User updateUser(Long id, UserDTO dto) {
        User user = getUserById(id);
        user.setFirstname(xssSanitizer.sanitize(dto.getFirstname()));
        user.setLastname(xssSanitizer.sanitize(dto.getLastname()));
        user.setEmail(xssSanitizer.sanitize(dto.getEmail()));
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setRoles(xssSanitizer.sanitize(dto.getRoles()));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);

        // Supprimer les tokens de réinitialisation
        passwordResetTokenRepository.deleteAll(passwordResetTokenRepository.findByUser(user));

        orderRepository.findByUser(user).forEach(order -> order.setUser(null));
        orderRepository.saveAll(orderRepository.findByUser(user));

        postCommunityRepository.findByUser(user).forEach(p -> p.setUser(null));
        postCommunityRepository.saveAll(postCommunityRepository.findByUser(user));

        blogRepository.findByUser(user).forEach(b -> b.setUser(null));
        blogRepository.saveAll(blogRepository.findByUser(user));

        commentRepository.deleteAll(commentRepository.findByUser(user));
        likeCommunityRepository.deleteAll(likeCommunityRepository.findByUser(user));

        reviewRepository.findByUser(user).forEach(r -> r.setUser(null));
        reviewRepository.saveAll(reviewRepository.findByUser(user));

        wateringReminderRepository.findByUser(user).forEach(r -> r.setUser(null));
        wateringReminderRepository.saveAll(wateringReminderRepository.findByUser(user));

        userRepository.delete(user);
    }

}
