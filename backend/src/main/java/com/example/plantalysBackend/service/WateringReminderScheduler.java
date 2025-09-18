package com.example.plantalysBackend.service;

import com.example.plantalysBackend.model.WateringReminder;
import com.example.plantalysBackend.repository.WateringReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WateringReminderScheduler {

    @Autowired
    private WateringReminderRepository wateringreminderRepo; 

    @Autowired
    private EmailService emailService;

    // Exécuté tous les jours à 8h
    @Scheduled(cron = "0 0 8 * * *", zone = "Europe/Paris")

    // @Scheduled(cron = "0 * * * * *") // pour tester chaque minute

    public void sendDailyReminders() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("Rappel lancé à : " + now);

        List<WateringReminder> allReminders = wateringreminderRepo.findAll();
        System.out.println("Total de rappels en base : " + allReminders.size());

        for (WateringReminder r : allReminders) {
            System.out.println("Rappel ID " + r.getId() + " prévu à : " + r.getNextReminder());
        }

        List<WateringReminder> dueReminders = allReminders.stream()
                .filter(r -> !r.getNextReminder().isAfter(now))
                .toList();

        System.out.println("Rappels à envoyer maintenant : " + dueReminders.size());

        for (WateringReminder reminder : dueReminders) {
            String email = reminder.getUser().getEmail();
            String name = reminder.getUser().getFirstname();
            String plant = reminder.getPlant().getName();

            System.out.println("Envoi du rappel à : " + email + " → plante : " + plant);

            // Envoi du mail
            emailService.sendWateringReminder(email, plant, name);

            // Replanification à 08:00 future
            int frequencyPerWeek = reminder.getFrequencyPerWeek();
            int interval = 7 / frequencyPerWeek;

            LocalDateTime nextReminder = now.plusDays(interval)
                    .withHour(8)
                    .withMinute(0)
                    .withSecond(0)
                    .withNano(0);

            System.out.println(" Prochain rappel pour ID " + reminder.getId() + " reprogrammé à : " + nextReminder);

            reminder.setNextReminder(nextReminder);
            wateringreminderRepo.save(reminder);
        }
    }
}
