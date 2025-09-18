package com.example.plantalysBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.plantalysBackend.model.CommentCommunity;
import com.example.plantalysBackend.model.User;

public interface CommentRepository extends JpaRepository<CommentCommunity, Long> {

    List<CommentCommunity> findByPostIdPostCommunityOrderByCreatedAtDesc(Long postId);
    List<CommentCommunity> findByUser(User user);
}
