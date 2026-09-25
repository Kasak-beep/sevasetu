package com.sevasetu.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ward number cannot be blank")
    @Column(nullable = false, unique = true)
    private String wardNumber; // e.g., "WARD-101"

    @NotBlank(message = "Area name cannot be blank")
    @Column(nullable = false)
    private String areaName;   // e.g., "Downtown North"

    private String city;       // Optional, or default to your municipality
}