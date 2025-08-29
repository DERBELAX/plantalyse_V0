package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.PlantDTO;
import com.example.plantalysBackend.model.Blog;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.BlogRepository;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/blogs")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminBlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<?> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAll();

        List<Map<String, Object>> response = blogs.stream().map(blog -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id_blog", blog.getId_blog());
            map.put("title", blog.getTitle());
            map.put("description", blog.getDescription());
            map.put("image", blog.getImage());
            map.put("createdat", blog.getCreatedat());
            map.put("updatedat", blog.getUpdatedat());

            if (blog.getUser() != null) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("email", blog.getUser().getEmail());
                map.put("user", userMap);
            }

            List<PlantDTO> plants = blog.getPlants() != null
                    ? blog.getPlants().stream()
                    .map(p -> new PlantDTO(p.getId(), p.getName(), p.getImages()))
                    .toList()
                    : List.of();

            map.put("plants", plants);
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createBlog(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "plantIds", required = false) List<Long> plantIds,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Principal principal) {

        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Le titre est requis");
        }

        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setDescription(description);
        blog.setCreatedat(LocalDateTime.now());
        blog.setUpdatedat(LocalDateTime.now());

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Utilisateur non trouvé"));
        blog.setUser(user);

        if (image != null && !image.isEmpty()) {
            try {
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filepath = Paths.get(uploadPath, filename);
                Files.copy(image.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                blog.setImage("/uploads/" + filename);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de l’upload de l’image : " + e.getMessage());
            }
        }

        if (plantIds != null && !plantIds.isEmpty()) {
            List<Plant> plants = plantRepository.findAllById(plantIds);
            blog.setPlants(plants);
        }

        blogRepository.save(blog);
        return ResponseEntity.status(HttpStatus.CREATED).body("Blog créé avec succès !");
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateBlog(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "plantIds", required = false) List<Long> plantIds,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Blog blog = blogRepository.findById(id).orElse(null);
        if (blog == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog introuvable");
        }

        blog.setTitle(title);
        blog.setDescription(description);
        blog.setUpdatedat(LocalDateTime.now());

        if (plantIds != null) {
            List<Plant> plants = plantRepository.findAllById(plantIds);
            blog.setPlants(plants);
        }

        if (image != null && !image.isEmpty()) {
            try {
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filepath = Paths.get(uploadPath, filename);
                Files.copy(image.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                blog.setImage("/uploads/" + filename);
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Erreur lors de l’upload de l’image");
            }
        }

        blogRepository.save(blog);
        return ResponseEntity.ok("Blog mis à jour avec succès.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        if (!blogRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog introuvable");
        }

        blogRepository.deleteById(id);
        return ResponseEntity.ok("Blog supprimé avec succès.");
    }
}
