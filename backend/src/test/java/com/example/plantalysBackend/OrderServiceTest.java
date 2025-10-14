package com.example.plantalysBackend;


import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.dto.OrderResponseDTO;
import com.example.plantalysBackend.model.Order;
import com.example.plantalysBackend.model.OrderItem;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.model.WateringReminder;
import com.example.plantalysBackend.repository.OrderRepository;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.repository.WateringReminderRepository;
import com.example.plantalysBackend.service.OrderService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock PlantRepository plantRepository;
    @Mock OrderRepository orderRepository;
    @Mock WateringReminderRepository wateringReminderRepository;

    @InjectMocks OrderService orderService;

    @Test
    void createOrderFromCart_ok_decremente_le_stock_persiste_et_cree_les_rappels() {
        // GIVEN
        Plant aloe = new Plant();
        aloe.setId(1L);
        aloe.setName("Aloe");
        aloe.setStock(5);
        aloe.setPrice(12.90);
        aloe.setFrequenceArrosage(2); // → 2 rappels / semaine attendus

        when(plantRepository.findById(1L)).thenReturn(Optional.of(aloe));

        // On simule la persistance : on “attribue” un id à la commande sauvegardée
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId_order(123L); 
            // par sécurité, on s’assure que l’association bidirectionnelle est en place
            if (o.getItems() != null) {
                for (OrderItem it : o.getItems()) {
                    it.setOrder(o);
                }
            }
            return o;
        });

        User user = new User();
        user.setId_user(7L);

        OrderItemDTO dto = new OrderItemDTO();
        dto.setPlantId(1L);
        dto.setQuantity(2);
        dto.setUnite_price(12.90);

        // WHEN
        OrderResponseDTO resp = orderService.createOrderFromCart(List.of(dto), user);

        // THEN
        assertThat(resp).isNotNull();
        assertThat(resp.getOrderId()).isEqualTo(123L);
        assertThat(resp.getItems()).hasSize(1);
        assertThat(resp.getItems().get(0).getPlantId()).isEqualTo(1L);
        assertThat(resp.getItems().get(0).getQuantity()).isEqualTo(2);

        // Stock décrémenté : 5 - 2 = 3
        assertThat(aloe.getStock()).isEqualTo(3);

        verify(orderRepository, times(1)).save(any(Order.class));
        verify(plantRepository, times(1)).save(aloe);

        // Avec frequenceArrosage = 2 → au moins 2 rappels créés
        verify(wateringReminderRepository, atLeast(2)).save(any(WateringReminder.class));
    }

    @Test
    void createOrderFromCart_ko_stock_insuffisant() {
        // GIVEN
        Plant p = new Plant();
        p.setId(1L);
        p.setName("Aloe");
        p.setStock(1); // insuffisant
        p.setPrice(10.0);
        p.setFrequenceArrosage(1);

        when(plantRepository.findById(1L)).thenReturn(Optional.of(p));

        User user = new User();
        user.setId_user(7L);

        OrderItemDTO dto = new OrderItemDTO();
        dto.setPlantId(1L);
        dto.setQuantity(2);         // > stock
        dto.setUnite_price(10.0);

        // WHEN + THEN
        assertThatThrownBy(() -> orderService.createOrderFromCart(List.of(dto), user))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Stock insuffisant");

        verify(orderRepository, never()).save(any());
        verify(wateringReminderRepository, never()).save(any());
    }
}
