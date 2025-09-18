package com.example.plantalysBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_item")
public class OrderItem {
	

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

    private Double unite_price;
    private Integer quantity;

    @ManyToOne
    private Order order;

    @ManyToOne
    @JoinColumn(name = "id_plante")
    private Plant plant;

	public OrderItem(Long id, Double unite_price, Integer quantity, Order order, Plant plant) {
		super();
		this.id = id;
		this.unite_price = unite_price;
		this.quantity = quantity;
		this.order = order;
		this.plant = plant;
	}

	public OrderItem() {
		super();
	}
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getUnite_price() {
		return unite_price;
	}

	public void setUnite_price(Double unite_price) {
		this.unite_price = unite_price;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Plant getPlant() {
		return plant;
	}

	public void setPlant(Plant plant) {
		this.plant = plant;
	}
}
