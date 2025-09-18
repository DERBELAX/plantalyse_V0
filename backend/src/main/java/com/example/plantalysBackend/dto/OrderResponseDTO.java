package com.example.plantalysBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    public Long getOrderId() {
		return orderId;
	}
	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public List<OrderItemDTO> getItems() {
		return items;
	}
	public void setItems(List<OrderItemDTO> items) {
		this.items = items;
	}
	private Long orderId;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    
    

}
