package com.example.plantalysBackend;


import com.example.plantalysBackend.dto.OrderItemDTO;
import com.example.plantalysBackend.model.Plant;
import com.example.plantalysBackend.model.User;
import com.example.plantalysBackend.repository.PlantRepository;
import com.example.plantalysBackend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderFlowIT {

@Autowired MockMvc mvc;
@Autowired PlantRepository plantRepo;
@Autowired UserRepository userRepo;
@Autowired ObjectMapper om;

Long plantId;

@BeforeEach
void seed() {
 plantRepo.deleteAll();
 userRepo.deleteAll();

 // Plante
 var p = new Plant();
 p.setName("Aloe");
 p.setStock(5);
 p.setPrice(12.90);
 plantId = plantRepo.save(p).getId();


 var u = new User();
 u.setEmail("alice@test.local"); 
 u.setFirstname("Alice");
 u.setPassword("x"); 
 u.setRoles("ROLE_USER");
 userRepo.save(u);
}

@Test
@WithMockUser(username = "alice@test.local", roles = {"USER"})
void fromCart_createsOrder_and_decrementsStock() throws Exception {
 var dto = new OrderItemDTO();
 dto.setPlantId(plantId);
 dto.setQuantity(2);
 dto.setUnite_price(12.90);

 mvc.perform(post("/api/orders/from-cart")
         .contentType(MediaType.APPLICATION_JSON)
         .content(om.writeValueAsBytes(List.of(dto))))
     .andExpect(status().is2xxSuccessful())
     .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
     .andExpect(jsonPath("$.orderId").exists());

 var reloaded = plantRepo.findById(plantId).orElseThrow();
 assertThat(reloaded.getStock()).isEqualTo(3); // 5 - 2
}
}


