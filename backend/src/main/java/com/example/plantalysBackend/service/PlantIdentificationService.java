package com.example.plantalysBackend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
@Service
public class PlantIdentificationService {
	@Value("${plant.id.api.key}")
    private String plantIdApiKey;

    public String identifyPlant(MultipartFile image) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Api-Key", plantIdApiKey);

        String base64Image = Base64.getEncoder().encodeToString(image.getBytes());

        Map<String, Object> requestPayload = Map.of(
                "images", List.of(base64Image),
                "organs", List.of("leaf", "flower")
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestPayload, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.plant.id/v2/identify", request, String.class
        );

        return response.getBody();
    }

}
