package com.example.plantalysBackend.dto;

public class ResetPasswordRequest {
	  private String token;
	    private String newPassword;

	    // Getter pour token
	    public String getToken() {
	        return token;
	    }

	    // Setter pour token
	    public void setToken(String token) {
	        this.token = token;
	    }

	    // Getter pour newPassword
	    public String getNewPassword() {
	        return newPassword;
	    }

	    // Setter pour newPassword
	    public void setNewPassword(String newPassword) {
	        this.newPassword = newPassword;
	    }

}
