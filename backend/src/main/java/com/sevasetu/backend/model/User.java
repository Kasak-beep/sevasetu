package com.sevasetu.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be blank")
    @Column(nullable = false, unique = true)
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    @NotBlank(message = "Password cannot be blank")
    @Column(nullable = false)
    private String password;

    @Pattern(regexp = "^[A-Z\\s]+$", message = "First name must contain only uppercase letters")
    @NotBlank(message = "First name cannot be blank")
    @Column(nullable = false)
    private String firstName; // Changed to lowercase 'f'

    @Column
    private String middleName;

    @Pattern(regexp = "^[A-Z\\s]+$", message = "Last name must contain only uppercase letters")
    @NotBlank(message = "Last name cannot be blank")
    @Column(nullable = false)
    private String lastName; // Changed to lowercase 'l'

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 numeric digits with no country code")
    private String phoneNumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    private String Otp;

    @Column(name = "is_verified", nullable = false)
      private Boolean verified = false;

    private LocalDateTime otpGeneratedTime;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

}