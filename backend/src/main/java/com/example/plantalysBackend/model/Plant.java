package com.example.plantalysBackend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;


@Entity
@Table(name = "plant")
public class Plant {


	public List<Blog> getBlogs() {
		return blogs;
	}


	public void setBlogs(List<Blog> blogs) {
		this.blogs = blogs;
	}

	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id_plante")    
	    private Long id;
	    @Column(columnDefinition = "TEXT")
	    private String description;

	    @ElementCollection
	    private List<String> images;

	    private Double price;
	    private String name;
	    private Integer stock;
	    @Column(columnDefinition = "TEXT")
	    private String entertainment;

	    private Integer watering_frequency;


	    @ManyToOne
	    @JoinColumn(name = "id_category") 
	    @JsonBackReference
	    private Category category;

		 
		public List<String> getImages() {
			return images;
		}


		public void setImages(List<String> images) {
			this.images = images;
		}

	    @ManyToMany(mappedBy = "plants")
	    @JsonIgnore
	    private List<Blog> blogs;


		


		public Plant(Long id, String description, List<String> images, Double price, String name, Integer stock,
				String entretien, Integer frequenceArrosage, Category category, List<Blog> blogs) {
			super();
			this.id = id;
			this.description = description;
			this.images = images;
			this.price = price;
			this.name = name;
			this.stock = stock;
			this.entertainment = entretien;
			this.watering_frequency = frequenceArrosage;
			this.category = category;
			this.blogs = blogs;
		}


		public Plant() {
			super();
		}
		
		
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		

		public Double getPrice() {
			return price;
		}

		public void setPrice(Double price) {
			this.price = price;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Integer getStock() {
			return stock;
		}

		public void setStock(Integer stock) {
			this.stock = stock;
		}

		public Category getCategory() {
			return category;
		}

		public void setCategory(Category category) {
			this.category = category;
		}
		public String getEntretien() {
		    return entertainment;
		}

		public void setEntretien(String entretien) {
		    this.entertainment = entretien;
		}

		public Integer getFrequenceArrosage() {
		    return watering_frequency;
		}

		public void setFrequenceArrosage(Integer frequenceArrosage) {
		    this.watering_frequency = frequenceArrosage;
		}



}
