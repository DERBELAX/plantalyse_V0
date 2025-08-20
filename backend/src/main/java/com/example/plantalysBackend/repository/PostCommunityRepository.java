package com.example.plantalysBackend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.plantalysBackend.model.PostCommunity;
import com.example.plantalysBackend.model.User;

public interface PostCommunityRepository extends JpaRepository<PostCommunity, Long> {

    // Récupère tous les posts triés par date de création décroissante
	List<PostCommunity> findAllByOrderByCreatedAtDesc();
	List<PostCommunity> findByUser(User user);


}

