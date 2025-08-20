package com.example.plantalysBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plantalysBackend.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
