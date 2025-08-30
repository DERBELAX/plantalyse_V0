package com.example.plantalysBackend.controller;

import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.repository.PlantRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PlantRepository plantRepository;

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody List<OrderItemDTO> items) {
        try {
            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

            for (OrderItemDTO item : items) {
                if (item.getPlantId() == null) {
                    return ResponseEntity.badRequest().body(Map.of("error", "plantId manquant"));
                }

                Optional<Plant> plantOpt = plantRepository.findById(item.getPlantId());
                if (plantOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Plante introuvable pour l'ID : " + item.getPlantId()));
                }

                Plant plant = plantOpt.get();

                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount((long) (item.getUnite_price() * 100)) // Stripe needs amount in cents
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(plant.getName())
                                    .build()
                            )
                            .build()
                    )
                    .build();

                lineItems.add(lineItem);
            }

            SessionCreateParams params = SessionCreateParams.builder()
                .addAllLineItem(lineItems)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/success")
                .setCancelUrl("http://localhost:3000/cart")
                .build();

            Session session = Session.create(params);
            return ResponseEntity.ok(Map.of("id", session.getId()));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur Stripe : " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }
}
