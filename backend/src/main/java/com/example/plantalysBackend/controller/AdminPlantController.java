package com.example.plantalysBackend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.plantalysBackend.model.Category;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.repository.CategoryRepository;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.service.PlantService;

@RestController
@RequestMapping("/api/admin/plants")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminPlantController {

    @Autowired
    private PlantService plantService;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping
    public List<Plant> getAllPlants() {
        return plantService.getAllPlants();
    }

    @PostMapping
    public ResponseEntity<?> addPlant(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam Long categoryId,
            @RequestParam String entretien,
            @RequestParam Integer frequenceArrosage,
            @RequestParam("images") MultipartFile[] images
    ) {
        try {
            List<String> imagePaths = new ArrayList<>();

            for (MultipartFile image : images) {
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filepath = Paths.get(uploadPath, filename);
                Files.copy(image.getInputStream(), filepath);
                imagePaths.add("/uploads/" + filename);
            }

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));

            Plant plant = new Plant();
            plant.setName(name);
            plant.setDescription(description);
            plant.setPrice(price);
            plant.setStock(stock);
            plant.setEntretien(entretien);
            plant.setFrequenceArrosage(frequenceArrosage);
            plant.setCategory(category);
            plant.setImages(imagePaths);

            plantRepository.save(plant);

            return ResponseEntity.ok().build();

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'enregistrement de l'image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlant(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam Long categoryId,
            @RequestParam String entretien,
            @RequestParam Integer frequenceArrosage,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) {
        try {
            Plant existingPlant = plantRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Plante introuvable"));

            existingPlant.setName(name);
            existingPlant.setDescription(description);
            existingPlant.setPrice(price);
            existingPlant.setStock(stock);
            existingPlant.setEntretien(entretien);
            existingPlant.setFrequenceArrosage(frequenceArrosage);

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
            existingPlant.setCategory(category);

            // Ajout des nouvelles images sans supprimer les anciennes
            if (images != null && images.length > 0) {
                List<String> imagePaths = existingPlant.getImages() != null
                        ? new ArrayList<>(existingPlant.getImages())
                        : new ArrayList<>();

                for (MultipartFile image : images) {
                    String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filepath = Paths.get(uploadPath, filename);
                    Files.copy(image.getInputStream(), filepath);
                    imagePaths.add("/uploads/" + filename);
                }

                existingPlant.setImages(imagePaths);
            }

            plantRepository.save(existingPlant);
            return ResponseEntity.ok("Plante mise à jour");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur d'upload image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
    }
}
