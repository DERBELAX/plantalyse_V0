package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.service.PlantIdentificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/identify")
@CrossOrigin(origins = "*")
public class PlantIdentificationController {

    @Autowired
    private PlantIdentificationService plantIdService;

    @PostMapping
    public ResponseEntity<?> identifyPlant(@RequestParam("image") MultipartFile image) {
        try {
            String result = plantIdService.identifyPlant(image);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'identification de la plante.");
        }
    }
}
