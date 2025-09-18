package com.example.plantalysBackend.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_community")
public class PostCommunity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_post_community")
    private Long idPostCommunity;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "createdat") 
    private LocalDateTime createdAt;

    private String image;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnore
    private User user;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentCommunity> comments;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<LikeCommunity> likes;

    public PostCommunity() {}

    public List<CommentCommunity> getComments() {
		return comments;
	}



	public void setComments(List<CommentCommunity> comments) {
		this.comments = comments;
	}



	public List<LikeCommunity> getLikes() {
		return likes;
	}



	public void setLikes(List<LikeCommunity> likes) {
		this.likes = likes;
	}

    public PostCommunity(Long idPostCommunity, String title, String description, LocalDateTime createdAt, String image,
			User user, List<CommentCommunity> comments, List<LikeCommunity> likes) {
		super();
		this.idPostCommunity = idPostCommunity;
		this.title = title;
		this.description = description;
		this.createdAt = createdAt;
		this.image = image;
		this.user = user;
		this.comments = comments;
		this.likes = likes;
	}



	public Long getIdPostCommunity() {
        return idPostCommunity;
    }

    public void setIdPostCommunity(Long idPostCommunity) {
        this.idPostCommunity = idPostCommunity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

}
