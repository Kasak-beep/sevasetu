package com.sevasetu.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("SevaSetu - Email Verification OTP");
        message.setText("Welcome to SevaSetu!\n\nYour One-Time Password (OTP) for registration is: " + otp + 
                        "\n\nThis code will expire in 5 minutes. Please do not share it with anyone.");
        
        mailSender.send(message);
    }
}