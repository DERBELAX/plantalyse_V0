package com.example.plantalysBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.dto.OrderResponseDTO;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.service.OrderService;

import java.util.*;

@RestController
@RequestMapping("/api/paypal")
public class PayPalController {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.secret}")
    private String clientSecret;

    @Value("${paypal.base.url}")
    private String baseUrl;
    @Autowired
    private OrderService orderService;

    private String getAccessToken() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> entity = new HttpEntity<>("grant_type=client_credentials", headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/v1/oauth2/token",
            HttpMethod.POST,
            entity,
            Map.class
        );

        return response.getBody().get("access_token").toString();
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createPayPalOrder(@RequestBody Map<String, Object> orderRequest) {
        String token = getAccessToken();

        Map<String, Object> orderPayload = Map.of(
            "intent", "CAPTURE",
            "purchase_units", List.of(Map.of(
                "amount", Map.of(
                    "currency_code", "EUR",
                    "value", orderRequest.get("amount")
                )
            )),
            "application_context", Map.of(
                "return_url", "https://plantalys.com/success",
                "cancel_url", "https://plantalys.com/cart"
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderPayload, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/v2/checkout/orders",
            HttpMethod.POST,
            request,
            Map.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/capture/{orderId}")
    public ResponseEntity<?> captureOrder(
        @PathVariable String orderId,
        @RequestBody Map<String, Object> body,
        @AuthenticationPrincipal User user
    ) {
        try {
            String token = getAccessToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(null, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/v2/checkout/orders/" + orderId + "/capture",
                HttpMethod.POST,
                request,
                Map.class
            );

            // ✅ Création de la commande réelle dans la BDD après paiement réussi
            List<Map<String, Object>> itemsRaw = (List<Map<String, Object>>) body.get("cartItems");

            List<OrderItemDTO> cartItems = new ArrayList<>();
            for (Map<String, Object> raw : itemsRaw) {
                OrderItemDTO dto = new OrderItemDTO();
                dto.setPlantId(Long.valueOf(raw.get("plantId").toString()));
                dto.setQuantity(Integer.parseInt(raw.get("quantity").toString()));
                dto.setUnite_price(Double.parseDouble(raw.get("unite_price").toString()));
                cartItems.add(dto);
            }

            OrderResponseDTO order = orderService.createOrderFromCart(cartItems, user);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la capture PayPal : " + e.getMessage()));
        }
    }

}
