package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime createdAt;
    private String firstname;
    private String lastname;
    private int likeCount;
    private List<CommentResponseDTO> comments;

    public PostResponseDTO(
        Long id,
        String title,
        String description,
        String image,
        LocalDateTime createdAt,
        String firstname,
        String lastname,
        int likeCount,
        List<CommentResponseDTO> comments
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.createdAt = createdAt;
        this.firstname = firstname;
        this.lastname = lastname;
        this.likeCount = likeCount;
        this.comments = comments;
    }

    // Getters uniquement
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImage() { return image; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public int getLikeCount() { return likeCount; }
    public List<CommentResponseDTO> getComments() { return comments; }
}
