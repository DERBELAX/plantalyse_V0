package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.model.ContactMessage;
import com.example.plantalysBackend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private ContactMessageRepository repository;

    @PostMapping
    public ResponseEntity<?> saveMessage(@RequestBody ContactMessage msg) {
        if (msg.getName() == null || msg.getEmail() == null || msg.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Champs manquants"));
        }

        msg.setSentAt(LocalDateTime.now());
        repository.save(msg);
        return ResponseEntity.ok(Map.of("status", "ok", "message", "Message enregistré"));
    }
}
