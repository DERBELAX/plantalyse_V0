package com.example.plantalysBackend.dto;

import com.example.plantalysBackend.model.User;

public class UserSummaryDTO {
	private String email;
	private Long id_user;
    private String firstname;
    private String lastname;
    private String roles;

    public UserSummaryDTO() {}

    public UserSummaryDTO(User user) {
    	this.id_user = user.getId_user();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.email = user.getEmail();
        this.roles = user.getRoles();
    }

    public Long getId_user() {
        return id_user;
    }

    public void setId_user(Long id_user) {
        this.id_user = id_user;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

	

}
