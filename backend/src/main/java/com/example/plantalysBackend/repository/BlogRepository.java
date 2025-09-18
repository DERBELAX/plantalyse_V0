package com.example.plantalysBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plantalysBackend.model.Blog;
import com.example.plantalysBackend.model.User;


public interface BlogRepository extends JpaRepository<Blog, Long>{
	 List<Blog> findByUser(User user);

}
