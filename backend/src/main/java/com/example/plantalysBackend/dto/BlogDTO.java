package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BlogDTO {
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

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public List<PlantDTO> getPlants() {
		return plants;
	}

	public void setPlants(List<PlantDTO> plants) {
		this.plants = plants;
	}

	private Long id_blog;
    private String title;
    private String description;
    private String image;
    private LocalDateTime createdat;
    private LocalDateTime updatedat;
    private String userEmail;
    private List<PlantDTO> plants;

    public BlogDTO(Long id_blog, String title, String description, String image,
                   LocalDateTime createdat, LocalDateTime updatedat,
                   String userEmail, List<PlantDTO> plants) {
        this.id_blog = id_blog;
        this.title = title;
        this.description = description;
        this.image = image;
        this.createdat = createdat;
        this.updatedat = updatedat;
        this.userEmail = userEmail;
        this.plants = plants;
    }

	public BlogDTO() {
		super();
	}

    
}
