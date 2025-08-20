package com.example.plantalysBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plantalysBackend.model.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long>{

}
