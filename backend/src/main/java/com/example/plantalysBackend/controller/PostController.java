package com.example.plantalysBackend.controller;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import com.example.plantalysBackend.security.UserDetailsImpl;
import com.example.plantalysBackend.dto.CommentResponseDTO;
import com.example.plantalysBackend.dto.PostResponseDTO;
import com.example.plantalysBackend.model.PostCommunity;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.PostCommunityRepository;


@RestController
@RequestMapping("/api/community/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired private PostCommunityRepository postRepository;


    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam(value = "image", required = false) MultipartFile imageFile,
        Authentication authentication) throws IOException {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        PostCommunity post = new PostCommunity();
        post.setTitle(title);
        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path path = Paths.get("uploads", fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, imageFile.getBytes());
            post.setImage("/uploads/" + fileName);
        }

        PostCommunity saved = postRepository.save(post);

        
        PostResponseDTO response = new PostResponseDTO(
            saved.getIdPostCommunity(),
            saved.getTitle(),
            saved.getDescription(),
            saved.getImage(),
            saved.getCreatedAt(),
            saved.getUser().getFirstname(),
            saved.getUser().getLastname(),
            saved.getLikes() != null ? saved.getLikes().size() : 0,
            List.of() 
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        List<PostCommunity> posts = postRepository.findAllByOrderByCreatedAtDesc();

        List<PostResponseDTO> response = posts.stream().map(post -> {
            List<CommentResponseDTO> comments = post.getComments().stream()
                .map(c -> new CommentResponseDTO(
                    c.getId(),
                    c.getUser() != null ? c.getUser().getFirstname() : "Utilisateur supprimé",
                    c.getContent(),
                    c.getCreatedAt()
                )).toList();

            String firstname = post.getUser() != null ? post.getUser().getFirstname() : "Utilisateur";
            String lastname = post.getUser() != null ? post.getUser().getLastname() : "supprimé";

            return new PostResponseDTO(
                post.getIdPostCommunity(), 
                post.getTitle(),
                post.getDescription(),
                post.getImage(),
                post.getCreatedAt(),
                firstname,
                lastname,
                post.getLikes() != null ? post.getLikes().size() : 0,
                comments
            );
        }).toList();

        return ResponseEntity.ok(response);
    }


}
