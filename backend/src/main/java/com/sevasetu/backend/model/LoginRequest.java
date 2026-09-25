package com.sevasetu.backend.model;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Getter 
@Setter
public class LoginRequest {
    @NotBlank(message="Email/Username cannot be blank")
    private String email;

    @NotBlank(message="Password= cannot be blank")
    private String password;
}
