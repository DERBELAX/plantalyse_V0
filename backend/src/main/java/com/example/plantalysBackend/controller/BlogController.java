package com.example.plantalysBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import com.example.plantalysBackend.dto.BlogDTO;
import com.example.plantalysBackend.dto.PlantDTO;
import com.example.plantalysBackend.repository.BlogRepository;
import com.example.plantalysBackend.model.Blog;
@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogController {
	@Autowired
    private BlogRepository blogRepository;

	@GetMapping
	public List<BlogDTO> getAll() {
	    return blogRepository.findAll().stream().map(blog -> {
	        List<PlantDTO> dtoPlants = blog.getPlants() != null
	            ? blog.getPlants().stream()
	                .map(p -> new PlantDTO(p.getId(), p.getName(), p.getImages()))
	                .toList()
	            : List.of();

	        return new BlogDTO(
	            blog.getId_blog(),
	            blog.getTitle(),
	            blog.getDescription(),
	            blog.getImage(),
	            blog.getCreatedat(),
	            blog.getUpdatedat(),
	            blog.getUser() != null ? blog.getUser().getEmail() : null,
	            dtoPlants
	        );
	    }).toList();
	}

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
            .map(blog -> {
            	List<PlantDTO> dtoPlants = blog.getPlants() != null
            		    ? blog.getPlants().stream()
            		        .map(p -> new PlantDTO(p.getId(), p.getName(), p.getImages()))
            		        .toList()
            		    : List.of();

                BlogDTO dto = new BlogDTO(
                    blog.getId_blog(),
                    blog.getTitle(),
                    blog.getDescription(),
                    blog.getImage(),
                    blog.getCreatedat(),
                    blog.getUpdatedat(),
                    blog.getUser() != null ? blog.getUser().getEmail() : null,
                    dtoPlants
                );
                return ResponseEntity.ok(dto);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
