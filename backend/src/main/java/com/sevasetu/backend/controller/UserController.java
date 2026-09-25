package com.sevasetu.backend.controller;

import com.sevasetu.backend.model.LoginRequest;
import com.sevasetu.backend.model.User;
import com.sevasetu.backend.repository.UserRepository;

import com.sevasetu.backend.service.UserService;

import jakarta.validation.Valid;

import java.util.Optional;
import java.time.LocalDateTime;

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

    // This handles a POST request when someone submits registration data
    @PostMapping("/register")
    // The @RequestBody annotation tells Spring: "Take the JSON from the front
    // end and turn it into a User object automatically"
    public String registerUser(@Valid @RequestBody User newUser) {
        // We then simply pass this object to our UserService logic
        return userService.registerUser(newUser);
    }

    @PostMapping("/login")
    public String loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
    }

    @PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isEmpty()) {
        return ResponseEntity.badRequest().body("User not found!");
    }

    User user = userOptional.get();

    if (user.isVerified()) {
        return ResponseEntity.ok("User is already verified!");
    }

    if (user.getOtp() == null || !user.getOtp().equals(otp)) {
        return ResponseEntity.badRequest().body("Invalid OTP!");
    }

    if (user.getOtpGeneratedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
        return ResponseEntity.badRequest().body("OTP has expired. Please request a new one.");
    }

    // Mark as verified & clear OTP data
    user.setVerified(true);
    user.setOtp(null);
    user.setOtpGeneratedTime(null);
    userRepository.save(user);

    return ResponseEntity.ok("Email verified successfully! You can now log in.");
}

}
