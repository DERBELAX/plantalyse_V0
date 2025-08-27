package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;

public class WateringReminderDTO {
    private String plantName;
    private String userName;
    private String userEmail;
    private int frequencyPerWeek;
    private LocalDateTime nextReminder;

    // Getters & Setters
    public String getPlantName() {
        return plantName;
    }

    public void setPlantName(String plantName) {
        this.plantName = plantName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getFrequencyPerWeek() {
        return frequencyPerWeek;
    }

    public void setFrequencyPerWeek(int frequencyPerWeek) {
        this.frequencyPerWeek = frequencyPerWeek;
    }

    public LocalDateTime getNextReminder() {
        return nextReminder;
    }

    public void setNextReminder(LocalDateTime nextReminder) {
        this.nextReminder = nextReminder;
    }
}
