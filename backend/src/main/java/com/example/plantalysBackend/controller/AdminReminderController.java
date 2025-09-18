package com.example.plantalysBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.plantalysBackend.dto.WateringReminderDTO;
import com.example.plantalysBackend.model.WateringReminder;
import com.example.plantalysBackend.repository.WateringReminderRepository;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/admin/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminReminderController {

    @Autowired
    private WateringReminderRepository wateringReminderRepository;

    @GetMapping
    public ResponseEntity<List<WateringReminderDTO>> getAllReminders() {
        List<WateringReminder> reminders = wateringReminderRepository.findAll();

        List<WateringReminderDTO> dtos = reminders.stream().map(reminder -> {
            WateringReminderDTO dto = new WateringReminderDTO();
            dto.setPlantName(reminder.getPlant() != null ? reminder.getPlant().getName() : "Inconnu");

            if (reminder.getUser() != null) {
                String firstname = reminder.getUser().getFirstname() != null ? reminder.getUser().getFirstname() : "";
                String lastname = reminder.getUser().getLastname() != null ? reminder.getUser().getLastname() : "";
                dto.setUserName((firstname + " " + lastname).trim());
                dto.setUserEmail(reminder.getUser().getEmail());
            } else {
                dto.setUserName("Inconnu");
                dto.setUserEmail("Inconnu");
            }

            dto.setFrequencyPerWeek(reminder.getFrequencyPerWeek());
            dto.setNextReminder(reminder.getNextReminder());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }
}
