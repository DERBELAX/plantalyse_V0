package com.example.plantalysBackend.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.service.UserService;
import com.example.plantalysBackend.dto.UserDTO;
import com.example.plantalysBackend.dto.UserSummaryDTO;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
	
	@Autowired
    private UserService userService;

	@PostMapping
	public User createUser(@RequestBody UserDTO dto) {
	    return userService.createUser(dto);
	}

  
	@GetMapping
	public List<UserSummaryDTO> getAllUsers() {
	    return userService.getAllUsers().stream()
	        .map(UserSummaryDTO::new)
	        .toList();
	}


    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }


}
