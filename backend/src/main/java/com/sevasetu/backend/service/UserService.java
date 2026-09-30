package com.sevasetu.backend.service;

import com.sevasetu.backend.model.LoginRequest;
import com.sevasetu.backend.model.User;
import com.sevasetu.backend.repository.UserRepository;
import com.sevasetu.backend.repository.WardRepository;
import com.sevasetu.backend.model.Ward;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private EmailService emailService;

    @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
private WardRepository wardRepository;



   public String registerUser(User newUser) {
    User existingUser = userRepository.findByEmail(newUser.getEmail()).orElse(null);

    if (existingUser != null) {
        return "Error: Email is already registered. Please log in";
    }
    // 1. Generate and attach OTP to the incoming user
    String otp = generateOtp();
    newUser.setOtp(otp);
    newUser.setOtpGeneratedTime(LocalDateTime.now());
    newUser.setVerified(false); // Fix: use setVerified (or setIsVerified depending on your Lombok version)
     
    newUser.setPassword(passwordEncoder.encode(newUser.getPassword())); 
  
    // Look up the ward by its ward number
    if (newUser.getWard() != null && newUser.getWard().getWardNumber() != null) {
        Ward ward = wardRepository.findByWardNumber(newUser.getWard().getWardNumber())
            .orElseThrow(() -> new RuntimeException("Invalid Ward Number"));
        newUser.setWard(ward);
    } else {
        throw new RuntimeException("Ward number is required.");
    }



    // 2. Save the unverified user to PostgreSQL
    userRepository.save(newUser);

    // 3. Send the OTP email
    try {
        emailService.sendOtpEmail(newUser.getEmail(), otp);
    } catch (Exception e) {
        System.err.println("Email dispatch error: " + e.getMessage());
        return "SUCCESS: User registered! (Email dispatch failed due to SMTP credentials. Dev OTP: " + otp + ")";
    }

    return "SUCCESS: User registered successfully! Please check your email for the OTP.";
}




    public String loginUser(LoginRequest loginRequest) {
        // Fixed Optional mapping (assuming findByEmail returns Optional<User>)
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
      

        if(!Boolean.TRUE.equals(user.getVerified())){
            throw new RuntimeException("Please verify your account with OTP before logging in.");
        }
        // Fixed: Use lowercase 'loginRequest' instance instead of uppercase 'LoginRequest',
        // and standard RuntimeException instead of RuntimeErrorException
        // Inside your login method:
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
           throw new RuntimeException("Invalid email or password");
}

        return "Login successful! Welcome back, " + user.getFirstName();
    }

    public String generateOtp() {
    java.util.Random random = new java.util.Random();
    int otp = 100000 + random.nextInt(900000); // Guarantees a 6-digit integer
    return String.valueOf(otp);
}
}