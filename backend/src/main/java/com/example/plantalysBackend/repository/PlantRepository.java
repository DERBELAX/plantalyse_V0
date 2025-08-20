package com.example.plantalysBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.plantalysBackend.model.Plant;

public interface PlantRepository extends JpaRepository<Plant, Long> {
	List<Plant> findByCategoryId(Long categoryId);
	@Query(
			  value = """
			    SELECT p.*
			    FROM plant p
			    JOIN order_item oi ON p.id_plante = oi.id_plante
			    GROUP BY p.id_plante
			    ORDER BY SUM(oi.quantity) DESC
			    LIMIT :limit
			    """,
			  nativeQuery = true
			)
			List<Plant> findTopSellingPlants(@Param("limit") int limit);

}
