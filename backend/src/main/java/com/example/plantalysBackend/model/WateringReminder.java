package com.example.plantalysBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "watering_reminder")
public class WateringReminder {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private LocalDateTime nextReminder;

	    private Integer frequencyPerWeek;

	    @ManyToOne
	    @JoinColumn(name = "id_user")
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "id_plante")
	    private Plant plant;

	    public Long getId() {
	        return id;
	    }

	    public LocalDateTime getNextReminder() {
	        return nextReminder;
	    }

	    public void setNextReminder(LocalDateTime nextReminder) {
	        this.nextReminder = nextReminder;
	    }

	    public Integer getFrequencyPerWeek() {
	        return frequencyPerWeek;
	    }

	    public void setFrequencyPerWeek(Integer frequencyPerWeek) {
	        this.frequencyPerWeek = frequencyPerWeek;
	    }

	    public User getUser() {
	        return user;
	    }

	    public void setUser(User user) {
	        this.user = user;
	    }

	    public Plant getPlant() {
	        return plant;
	    }

	    public void setPlant(Plant plant) {
	        this.plant = plant;
	    }

}
