package com.sevasetu.backend.controller;

import com.sevasetu.backend.model.LoginRequest;
import com.sevasetu.backend.model.User;
import com.sevasetu.backend.repository.UserRepository;
//import com.sevasetu.backend.config.SecurityConfig;
import com.sevasetu.backend.service.UserService;

import jakarta.validation.Valid;

//import java.util.Optional;
//import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Tells Spring Boot: "This class will handle web requests from users"
@RequestMapping("/users") // Sets the base URL path (e.g., localhost:8080/api/users)
public class UserController {
    @Autowired // Injects our UserService manager so the controller can talk to it
    private UserService userService;

    @Autowired 
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        String response = userService.registerUser(user);
        if (response.startsWith("Error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try{
            String response = userService.loginUser(loginRequest);
        return ResponseEntity.ok(response);}
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is already verified
        if (Boolean.TRUE.equals(user.getVerified())) {
            return ResponseEntity.ok("User is already verified!");
        }

        // Your OTP verification logic here...
        if (user.getOtp() != null && user.getOtp().equals(otp)) {
            user.setVerified(true);
            user.setOtp(null); // Clear OTP after success
            userRepository.save(user);
            return ResponseEntity.ok("OTP verified successfully!");
        }

        return ResponseEntity.badRequest().body("Invalid OTP");
    }
  
}
