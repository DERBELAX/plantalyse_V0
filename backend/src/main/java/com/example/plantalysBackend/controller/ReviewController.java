package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.ReviewRequestDTO;
import com.example.plantalysBackend.dto.ReviewResponseDTO;
import com.example.plantalysBackend.model.Review;
import com.example.plantalysBackend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequestDTO reviewDTO, Principal principal) {
        try {
            Review saved = reviewService.createReview(reviewDTO, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la création de l'avis");
        }
    }

    @GetMapping("/plant/{plantId}")
    public List<ReviewResponseDTO> getReviewsByPlant(@PathVariable Long plantId) {
        return reviewService.getReviewsByPlant(plantId);
    }
    @GetMapping
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }

}
