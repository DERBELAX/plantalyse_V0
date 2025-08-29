package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.WateringReminderDTO;
import com.example.plantalysBackend.model.WateringReminder;
import com.example.plantalysBackend.repository.WateringReminderRepository;
import com.example.plantalysBackend.repository.UserRepository;
import com.example.plantalysBackend.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class UserReminderController {

    @Autowired
    private WateringReminderRepository wateringReminderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyReminders(Principal principal) {
        String email = principal.getName();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Utilisateur introuvable");
        }

        User user = optionalUser.get();

        List<WateringReminder> reminders = wateringReminderRepository.findByUser(user);

        List<WateringReminderDTO> dtos = reminders.stream().map(r -> {
            WateringReminderDTO dto = new WateringReminderDTO();
            dto.setPlantName(r.getPlant().getName());
            dto.setFrequencyPerWeek(r.getFrequencyPerWeek());
            dto.setNextReminder(r.getNextReminder());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}

