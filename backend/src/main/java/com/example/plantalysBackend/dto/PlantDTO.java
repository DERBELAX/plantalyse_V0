package com.example.plantalysBackend.dto;

import java.util.List;

public class PlantDTO {
   

	private Long id;
    private String name;
    private String mainImage;

    public PlantDTO(Long id, String name, List<String> images) {
        this.id = id;
        this.name = name;
        this.mainImage = (images != null && !images.isEmpty()) ? images.get(0) : null;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMainImage() {
        return mainImage;
    }
    public void setId(Long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setMainImage(String mainImage) {
		this.mainImage = mainImage;
	}
    
}
