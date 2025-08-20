package com.example.plantalysBackend.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "category")
public class Category {
	  
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_category")    
	private Long id;
	private String name;
	
	@OneToMany(mappedBy = "category")
	@JsonManagedReference
	private List<Plant> plants;
	
	public Category(Long id_category, String name, List<Plant> plants) {
			super();
			this.id = id_category;
			this.name = name;
			this.plants = plants;
		}
		public Category() {
			super();
		}
	    
		public Long getId_category() {
			return id;
		}
		public void setId_category(Long id_category) {
			this.id = id_category;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public List<Plant> getPlants() {
			return plants;
		}
		public void setPlants(List<Plant> plants) {
			this.plants = plants;
		}
}
