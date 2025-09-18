package com.example.plantalysBackend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "`user`")
public class User {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_user")
	private Long id_user;
    private String lastname;
    private String firstname;
    private String password;
    private String roles;
    private String email;
    private boolean oauthUser = false;

    public boolean isOauthUser() {
        return oauthUser;
    }

    public User(Long id_user, String lastname, String firstname, String password, String roles, String email,
			boolean oauthUser, List<Order> orders, List<Blog> blogs, List<PostCommunity> posts) {
		super();
		this.id_user = id_user;
		this.lastname = lastname;
		this.firstname = firstname;
		this.password = password;
		this.roles = roles;
		this.email = email;
		this.oauthUser = oauthUser;
		this.orders = orders;
		this.blogs = blogs;
		this.posts = posts;
	}

	public void setOauthUser(boolean oauthUser) {
        this.oauthUser = oauthUser;
    }
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "user")
    private List<Blog> blogs;

    @OneToMany
    @JoinColumn(name = "id_user")
    @JsonIgnoreProperties({"posts", "blogs", "password"})
    private List<PostCommunity> posts;

    
    public Long getId_user() {
		return id_user;
	}

	public void setId_user(Long id_user) {
		this.id_user = id_user;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public List<Blog> getBlogs() {
		return blogs;
	}

	public void setBlogs(List<Blog> blogs) {
		this.blogs = blogs;
	}

	public List<PostCommunity> getPosts() {
		return posts;
	}

	public void setPosts(List<PostCommunity> posts) {
		this.posts = posts;
	}

	

	public User() {
		super();
	}

	
}
