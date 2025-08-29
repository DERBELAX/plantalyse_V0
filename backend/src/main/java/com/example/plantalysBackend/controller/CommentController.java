package com.example.plantalysBackend.controller;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.plantalysBackend.dto.CommentDTO;
import com.example.plantalysBackend.dto.CommentResponseDTO;
import com.example.plantalysBackend.dto.PostResponseDTO;
import com.example.plantalysBackend.model.CommentCommunity;
import com.example.plantalysBackend.model.PostCommunity;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.CommentRepository;
import com.example.plantalysBackend.repository.PostCommunityRepository;
import com.example.plantalysBackend.repository.UserRepository;


@RestController
@RequestMapping("/api/community/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired private CommentRepository commentRepository;
    @Autowired private UserRepository userRepo;
    @Autowired private PostCommunityRepository postRepository;
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentDTO dto, Principal principal) {
    	Optional<User> optionalUser = userRepo.findByEmail(principal.getName());

    	if (optionalUser.isEmpty()) {
    	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur introuvable.");
    	}

    	User user = optionalUser.get();
        PostCommunity post = postRepository.findById(dto.getPostId()).orElseThrow();

        CommentCommunity comment = new CommentCommunity();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(dto.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        CommentCommunity saved = commentRepository.save(comment);

        
        CommentResponseDTO response = new CommentResponseDTO(
                saved.getId(),                        
                saved.getUser().getFirstname(),
                saved.getContent(),
                saved.getCreatedAt()
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
                    c.getUser().getFirstname(),
                    c.getContent(),
                    c.getCreatedAt()
                )).toList();

            return new PostResponseDTO(
                post.getIdPostCommunity(),
                post.getTitle(),
                post.getDescription(),
                post.getImage(),
                post.getCreatedAt(),
                post.getUser().getFirstname(),
                post.getUser().getLastname(),
                post.getLikes().size(),
                comments
            );
        }).toList();

        return ResponseEntity.ok(response);
    }



}

