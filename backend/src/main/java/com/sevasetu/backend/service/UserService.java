package com.sevasetu.backend.service;

import com.sevasetu.backend.model.User;
import com.sevasetu.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String registerUser(User newUser) {
        User existingUser = userRepository.findByEmail(newUser.getEmail());

        if (existingUser != null) {
            return "Error:Email is already registered.Please log in";
        }

        userRepository.save(newUser);
        return "SUCCESS: user registered successfully!";
    }

}
