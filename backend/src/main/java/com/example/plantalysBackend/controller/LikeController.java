package com.example.plantalysBackend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.plantalysBackend.model.LikeCommunity;
import com.example.plantalysBackend.model.PostCommunity;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.LikeCommunityRepository;
import com.example.plantalysBackend.repository.PostCommunityRepository;
import com.example.plantalysBackend.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/community/likes")
@CrossOrigin(origins = "http://localhost:3000")
public class LikeController {

    @Autowired private LikeCommunityRepository likeRepository;
    @Autowired private PostCommunityRepository postRepository;

    @PostMapping("/{postId}/toggle")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        PostCommunity post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post introuvable"));

        Optional<LikeCommunity> existingLike = likeRepository.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            LikeCommunity like = new LikeCommunity();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
        }

        return ResponseEntity.ok().build();
    }
}
