package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;

public class CommentResponseDTO {
    private Long id; 
    private String firstname;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponseDTO(Long id, String firstname, String content, LocalDateTime createdAt) {
        this.id = id;
        this.firstname = firstname;
        this.content = content;
        this.createdAt = createdAt;
    }

   
    public Long getId() {
        return id;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
