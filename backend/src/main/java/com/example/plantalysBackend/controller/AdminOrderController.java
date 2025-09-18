package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.OrderDTO;
import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.model.Order;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.OrderRepository;
import com.example.plantalysBackend.repository.PlantRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PlantRepository plantRepository;
    // Récupérer toutes les commandes
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        List<OrderDTO> orderDTOs = orders.stream().map(order -> {
            OrderDTO dto = new OrderDTO(order);
            dto.setId(order.getId());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedat());

            if (order.getUser() != null) {
            	User user = order.getUser();
            	if (user != null) {
            	    dto.setUserEmail(user.getEmail());

            	    String fullName = (user.getFirstname() != null ? user.getFirstname() : "")
            	                    + " "
            	                    + (user.getLastname() != null ? user.getLastname() : "");

            	    dto.setUserName(fullName.trim().isBlank() ? user.getEmail() : fullName.trim());
            	} else {
            	    dto.setUserEmail("Inconnu");
            	    dto.setUserName("Inconnu");
            	}

            } else {
                dto.setUserEmail("Inconnu");
            }

            List<OrderItemDTO> items = order.getItems().stream().map(item -> {
                OrderItemDTO i = new OrderItemDTO();
                i.setId(item.getId());
                i.setPlantName(item.getPlant().getName());
                i.setUnite_price(item.getUnite_price());
                i.setQuantity(item.getQuantity());

                // Ajout de l’image principale (s’il y en a une)
                List<String> images = item.getPlant().getImages();
                if (images != null && !images.isEmpty()) {
                    i.setPlantImage(images.get(0));
                } else {
                    i.setPlantImage(null);
                }

                return i;
            }).toList();

            dto.setItems(items);
            return dto;
        }).toList();

        return ResponseEntity.ok(orderDTOs);
    }




    // Valider une commande
    @PutMapping("/{id}/validate")
    @Transactional
    public ResponseEntity<?> validateOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        order.setStatus("Validée"); 
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/admin/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Plant>> getAllStocks() {
        return ResponseEntity.ok(plantRepository.findAll());
    }

}
