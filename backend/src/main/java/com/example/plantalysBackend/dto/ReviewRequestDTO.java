package com.example.plantalysBackend.dto;

public class ReviewRequestDTO {
    private Long plantId;
    private String content;
    private int rating;

    // Getters & setters
    public Long getPlantId() {
        return plantId;
    }

    public void setPlantId(Long plantId) {
        this.plantId = plantId;
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
}

