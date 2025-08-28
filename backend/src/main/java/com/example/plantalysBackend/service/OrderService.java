package com.example.plantalysBackend.service;

import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.dto.OrderResponseDTO;
import com.example.plantalysBackend.model.*;
import com.example.plantalysBackend.repository.OrderRepository;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.repository.WateringReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private WateringReminderRepository wateringReminderRepo;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public OrderResponseDTO createOrderFromCart(List<OrderItemDTO> cartItems, User user) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Le panier est vide.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("EN_ATTENTE");
        order.setCreatedat(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO dto : cartItems) {
            //  On récupère bien la plante par son ID
        	Plant plant = plantRepository.findById(dto.getPlantId())
        		    .orElseThrow(() -> new IllegalArgumentException("Plante introuvable : ID " + dto.getPlantId()));


            if (plant.getStock() < dto.getQuantity()) {
                throw new IllegalStateException("Stock insuffisant pour : " + plant.getName());
            }

            // Décrémente le stock
            plant.setStock(plant.getStock() - dto.getQuantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setPlant(plant);
            item.setQuantity(dto.getQuantity());
            item.setUnite_price(dto.getUnite_price());

            items.add(item);
        }

        order.setItems(items);
        Order savedOrder = orderRepository.save(order);

        // ✅ Mise à jour du stock des plantes
        items.forEach(i -> plantRepository.save(i.getPlant()));

        // ✅ Création des rappels d'arrosage
        for (OrderItem item : savedOrder.getItems()) {
            Plant plant = item.getPlant();
            Integer freq = plant.getFrequenceArrosage();
            if (freq != null && freq > 0) {
                int intervalDays = 7 / freq;
                for (int i = 0; i < freq; i++) {
                    WateringReminder reminder = new WateringReminder();
                    reminder.setUser(user);
                    reminder.setPlant(plant);
                    reminder.setFrequencyPerWeek(freq);
                    reminder.setNextReminder(order.getCreatedat().plusDays((long) i * intervalDays));
                    wateringReminderRepo.save(reminder);
                }
            }
        }

        // ✅ Construction de la réponse DTO
        OrderResponseDTO response = new OrderResponseDTO();
        response.setOrderId(savedOrder.getId());
        response.setStatus(savedOrder.getStatus());
        response.setCreatedAt(savedOrder.getCreatedat());

        List<OrderItemDTO> responseItems = new ArrayList<>();
        for (OrderItem item : savedOrder.getItems()) {
            OrderItemDTO dto = new OrderItemDTO();

            // C’est bien l’ID de la plante ici 
            dto.setPlantId(item.getPlant().getId()); 
            dto.setId(item.getId()); 
            dto.setPlantName(item.getPlant().getName());
            dto.setQuantity(item.getQuantity());
            dto.setUnite_price(item.getUnite_price());


            responseItems.add(dto);
        }

        response.setItems(responseItems);
        return response;
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(updatedOrder.getStatus());
            order.setCreatedat(updatedOrder.getCreatedat());
            return orderRepository.save(order);
        }).orElseThrow(() -> new IllegalArgumentException("Commande non trouvée"));
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Commande introuvable.");
        }
        orderRepository.deleteById(id);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
}
