package com.example.plantalysBackend;



import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.CALLS_REAL_METHODS;

import java.time.LocalDateTime;
import java.util.List;

import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.model.WateringReminder;
import com.example.plantalysBackend.repository.WateringReminderRepository;
import com.example.plantalysBackend.service.EmailService;
import com.example.plantalysBackend.service.WateringReminderScheduler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class WateringReminderSchedulerTest {

@Mock WateringReminderRepository wateringRepo;
@Mock EmailService emailService;
@InjectMocks WateringReminderScheduler scheduler;

@Test
void sendDailyReminders_envoie_mail_et_reprogramme_selon_7_div_freq_a_8h() {
 // now figé
 LocalDateTime fixedNow = LocalDateTime.of(2025, 1, 15, 10, 12, 0);

 try (var mocked = Mockito.mockStatic(LocalDateTime.class, CALLS_REAL_METHODS)) {
   mocked.when(LocalDateTime::now).thenReturn(fixedNow);

   var user = new User();
   user.setEmail("alice@ex.com");
   user.setFirstname("Alice");

   var plant = new Plant();
   plant.setName("Monstera");

   var reminder = new WateringReminder();
   ReflectionTestUtils.setField(reminder, "id", 1L);   // pas de setId()
   reminder.setUser(user);
   reminder.setPlant(plant);
   reminder.setFrequencyPerWeek(2);                    // 2 fois / semaine → interval = 7 / 2 = 3 jours
   reminder.setNextReminder(fixedNow.minusHours(1));   // dû

   when(wateringRepo.findAll()).thenReturn(List.of(reminder));

   // WHEN
   scheduler.sendDailyReminders();

   // THEN
   verify(emailService).sendWateringReminder("alice@ex.com", "Monstera", "Alice");

   int intervalDays = Math.max(1, 7 / reminder.getFrequencyPerWeek()); // => 3
   LocalDateTime expectedNext = fixedNow
       .plusDays(intervalDays)
       .withHour(8).withMinute(0).withSecond(0).withNano(0);

   verify(wateringRepo).save(argThat(saved -> {
     assertThat(saved.getId()).isEqualTo(1L);
     assertThat(saved.getNextReminder()).isEqualTo(expectedNext);
     return true;
   }));
 }
}

@Test
void sendDailyReminders_ignore_les_non_echus() {
 LocalDateTime fixedNow = LocalDateTime.of(2025, 1, 15, 10, 12, 0);

 try (var mocked = Mockito.mockStatic(LocalDateTime.class, CALLS_REAL_METHODS)) {
   mocked.when(LocalDateTime::now).thenReturn(fixedNow);

   var user = new User();  user.setEmail("bob@ex.com"); user.setFirstname("Bob");
   var plant = new Plant(); plant.setName("Aloe");

   var notDue = new WateringReminder();
   ReflectionTestUtils.setField(notDue, "id", 2L);
   notDue.setUser(user);
   notDue.setPlant(plant);
   notDue.setFrequencyPerWeek(3);                   // 3 fois / semaine → ~2 jours
   notDue.setNextReminder(fixedNow.plusHours(2));   

   when(wateringRepo.findAll()).thenReturn(List.of(notDue));

   // WHEN
   scheduler.sendDailyReminders();

   // THEN
   verify(emailService, never()).sendWateringReminder(any(), any(), any());
   verify(wateringRepo, never()).save(any());
 }
}
}

