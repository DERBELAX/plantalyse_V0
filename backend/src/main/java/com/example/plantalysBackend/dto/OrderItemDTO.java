package com.example.plantalysBackend.dto;

public class OrderItemDTO {
	
	
	private Long id;
    private String plantName;
    private String plantImage;
    private int quantity;
    private double unite_price;
    private Long plantId;

    public Long getPlantId() {
        return plantId;
    }

    public void setPlantId(Long plantId) {
        this.plantId = plantId;
    }

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getPlantName() {
		return plantName;
	}
	public void setPlantName(String plantName) {
		this.plantName = plantName;
	}
	public String getPlantImage() {
		return plantImage;
	}
	public void setPlantImage(String plantImage) {
		this.plantImage = plantImage;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public double getUnite_price() {
		return unite_price;
	}
	public void setUnite_price(double unite_price) {
		this.unite_price = unite_price;
	}
	public OrderItemDTO(Long id, String plantName, String plantImage, int quantity, double unite_price, Long plantId) {
	    this.id = id;
	    this.plantName = plantName;
	    this.plantImage = plantImage;
	    this.quantity = quantity;
	    this.unite_price = unite_price;
	    this.plantId = plantId;
	}

	
	public OrderItemDTO() {
		super();
	}
	
    
	

}
