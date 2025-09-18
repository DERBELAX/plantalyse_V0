package com.example.plantalysBackend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.model.WateringReminder;

public interface WateringReminderRepository extends JpaRepository <WateringReminder, Long>{
	 List<WateringReminder> findByUserAndNextReminderBefore(User user, LocalDateTime now);
	 List<WateringReminder> findByUser(User user);

}
