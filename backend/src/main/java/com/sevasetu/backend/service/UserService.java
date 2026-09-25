package com.sevasetu.backend.service;

import com.sevasetu.backend.model.LoginRequest;
import com.sevasetu.backend.model.User;
import com.sevasetu.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private EmailService emailService;

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

    // 2. Save the unverified user to PostgreSQL
    userRepository.save(newUser);

    // 3. Send the OTP email
    emailService.sendOtpEmail(newUser.getEmail(), otp);

    return "SUCCESS: User registered successfully! Please check your email for the OTP.";
}

    public String loginUser(LoginRequest loginRequest) {
        // Fixed Optional mapping (assuming findByEmail returns Optional<User>)
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
      
        // Fixed: Use lowercase 'loginRequest' instance instead of uppercase 'LoginRequest',
        // and standard RuntimeException instead of RuntimeErrorException
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return "Login successful! Welcome back, " + user.getFirstName();
    }

    public String generateOtp() {
    java.util.Random random = new java.util.Random();
    int otp = 100000 + random.nextInt(900000); // Guarantees a 6-digit integer
    return String.valueOf(otp);
}
}