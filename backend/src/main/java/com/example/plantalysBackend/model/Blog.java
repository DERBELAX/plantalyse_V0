package com.example.plantalysBackend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "blog")
public class Blog {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_blog;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String image;
    private LocalDateTime createdat;
    private LocalDateTime updatedat;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "post_plante",
        joinColumns = @JoinColumn(name = "id_blog"),
        inverseJoinColumns = @JoinColumn(name = "id_plante")
    )
    private List<Plant> plants = new ArrayList<>();

	

	public Blog(Long id_blog, String title, String description, String image, LocalDateTime createdat,
			LocalDateTime updatedat, User user, List<Plant> plants) {
		super();
		this.id_blog = id_blog;
		this.title = title;
		this.description = description;
		this.image = image;
		this.createdat = createdat;
		this.updatedat = updatedat;
		this.user = user;
		this.plants = plants;
	}
	public Blog() {
		super();
	}
	public Long getId_blog() {
		return id_blog;
	}

	public void setId_blog(Long id_blog) {
		this.id_blog = id_blog;
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
	public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

	public LocalDateTime getCreatedat() {
		return createdat;
	}

	public void setCreatedat(LocalDateTime createdat) {
		this.createdat = createdat;
	}

	public LocalDateTime getUpdatedat() {
		return updatedat;
	}

	public void setUpdatedat(LocalDateTime updatedat) {
		this.updatedat = updatedat;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<Plant> getPlants() {
		return plants;
	}

	public void setPlants(List<Plant> plants) {
		this.plants = plants;
	}

}
