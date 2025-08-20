package com.example.plantalysBackend.repository;

import com.example.plantalysBackend.model.Review;
import com.example.plantalysBackend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPlantId(Long plantId);
    List<Review> findByUser(User user);

}

