package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;

import com.example.plantalysBackend.model.Review;

public class ReviewResponseDTO{
    private String userName;
    private String userEmail;
    private String content;
    private int rating;
    private LocalDateTime createdAt;

    // Getters & setters
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public ReviewResponseDTO(Review review) {
        if (review.getUser() != null) {
            this.userName = review.getUser().getFirstname() + " " + review.getUser().getLastname();
            this.userEmail = review.getUser().getEmail();
        } else {
            this.userName = "Utilisateur supprimé";
            this.userEmail = "Inconnu";
        }

        this.content = review.getContent();
        this.rating = review.getRating();
        this.createdAt = review.getCreatedAt();
    }
}

