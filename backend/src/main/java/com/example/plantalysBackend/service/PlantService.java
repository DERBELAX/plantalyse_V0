package com.example.plantalysBackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.repository.PlantRepository;

@Service
public class PlantService {
	@Autowired
    private PlantRepository plantRepository;

    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    public Optional<Plant> getPlantById(Long id) {
        return plantRepository.findById(id);
    }

    public Plant createPlant(Plant plant) {
        return plantRepository.save(plant);
    }

    public Plant updatePlant(Long id, Plant updatedPlant) {
        return plantRepository.findById(id).map(plant -> {
            plant.setName(updatedPlant.getName());
            plant.setDescription(updatedPlant.getDescription());
            plant.setImages(updatedPlant.getImages());
            plant.setPrice(updatedPlant.getPrice());
            plant.setStock(updatedPlant.getStock());
            return plantRepository.save(plant);
        }).orElseGet(() -> {
            updatedPlant.setId(id);
            return plantRepository.save(updatedPlant);
        });
    }

    public void deletePlant(Long id) {
        plantRepository.deleteById(id);
    }
   

    public List<Plant> getPlantsByCategoryId(Long categoryId) {
        return plantRepository.findByCategoryId(categoryId);
    }

    public List<Plant> getTopSellingPlants(int limit) {
        return plantRepository.findTopSellingPlants(limit);
    }

}
