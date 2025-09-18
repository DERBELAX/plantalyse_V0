package com.example.plantalysBackend.service;

import com.example.plantalysBackend.dto.ReviewRequestDTO;
import com.example.plantalysBackend.dto.ReviewResponseDTO;
import com.example.plantalysBackend.model.Review;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.repository.ReviewRepository;
import com.example.plantalysBackend.repository.OrderRepository;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PlantRepository plantRepo;
    @Autowired private OrderRepository orderRepo;

    public Review createReview(ReviewRequestDTO dto, Principal principal) {
    	 User user = userRepo.findByEmail(principal.getName())
    		        .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable."));

        Plant plant = plantRepo.findById(dto.getPlantId())
            .orElseThrow(() -> new IllegalArgumentException("Plante introuvable."));

        boolean hasPurchased = orderRepo.existsByUserAndItemsPlantId(user, plant.getId());
        if (!hasPurchased) {
            throw new IllegalStateException("Vous devez avoir acheté cette plante pour laisser un avis.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setPlant(plant);
        review.setContent(dto.getContent());
        review.setRating(dto.getRating());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepo.save(review);
    }

    public List<ReviewResponseDTO> getReviewsByPlant(Long plantId) {
        return reviewRepo.findByPlantId(plantId).stream()
            .map(ReviewResponseDTO::new)
            .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepo.findAll().stream()
            .map(ReviewResponseDTO::new)
            .collect(Collectors.toList());
    }
}
