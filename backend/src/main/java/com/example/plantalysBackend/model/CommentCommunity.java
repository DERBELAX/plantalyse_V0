package com.example.plantalysBackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comment_community")
public class CommentCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "id_post_community")  
    private PostCommunity post;

    @ManyToOne
    @JoinColumn(name = "id_user")  
    private User user;

    public CommentCommunity() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PostCommunity getPost() {
        return post;
    }

    public void setPost(PostCommunity post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
