package com.sevasetu.backend.controller;

import com.sevasetu.backend.model.User;
import com.sevasetu.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController // Tells Spring Boot: "This class will handle web requests from users"
@RequestMapping("/users") // Sets the base URL path (e.g., localhost:8080/api/users)
public class UserController {
    @Autowired // Injects our UserService manager so the controller can talk to it
    private UserService userService;

    // This handles a POST request when someone submits registration data
    @PostMapping("/register")
    // The @RequestBody annotation tells Spring: "Take the JSON from the front
    // end and turn it into a User object automatically"
    public String registerUser(@Valid @RequestBody User newUser) {
        // We then simply pass this object to our UserService logic
        return userService.registerUser(newUser);
    }

}
