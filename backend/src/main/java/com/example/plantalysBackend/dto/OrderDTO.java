package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.plantalysBackend.model.Order;

public class OrderDTO {
	private Long id;
    private String status;
    private String userEmail;
    private String userName;
    private Long plantId; 
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
	  public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public List<OrderItemDTO> getItems() {
		return items;
	}
	public void setItems(List<OrderItemDTO> items) {
		this.items = items;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	    
	public String getUserName() {
	    return userName;
	}

	public void setUserName(String userName) {
	    this.userName = userName;
	}
	public Long getPlantId() {
	    return plantId;
	}

	public void setPlantId(Long plantId) {
	    this.plantId = plantId;
	}
	// Ajoute ce constructeur dans ta classe OrderDTO

	public OrderDTO(Order order) {
	    this.id = order.getId();
	    this.status = order.getStatus();
	    this.createdAt = order.getCreatedat();

	    // user infos
	    if (order.getUser() != null) {
	        this.userEmail = order.getUser().getEmail();
	        this.userName = order.getUser().getFirstname() + " " + order.getUser().getLastname();
	    }

	    // transform order items
	    this.items = order.getItems().stream().map(item -> {
	        String plantName = item.getPlant() != null ? item.getPlant().getName() : null;
	        String plantImage = (item.getPlant() != null && item.getPlant().getImages() != null && !item.getPlant().getImages().isEmpty())
	            ? item.getPlant().getImages().get(0)
	            : null;

	        OrderItemDTO dto = new OrderItemDTO(
	            item.getId(),           // ID de l'OrderItem
	            plantName,
	            plantImage,
	            item.getQuantity(),
	            item.getUnite_price(),
	            item.getPlant() != null ? item.getPlant().getId() : null
	        );

	        // ✅ Ajouter plantId manuellement ici
	        if (item.getPlant() != null) {
	            dto.setPlantId(item.getPlant().getId());
	        }

	        return dto;
	    }).toList();

	}

}
