package com.example.plantalysBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plantalysBackend.model.LikeCommunity;
import com.example.plantalysBackend.model.PostCommunity;
import com.example.plantalysBackend.model.User;

public interface LikeCommunityRepository extends JpaRepository<LikeCommunity, Long> {

    Optional<LikeCommunity> findByPostAndUser(PostCommunity post, User user);
    List<LikeCommunity> findByUser(User user);
}

