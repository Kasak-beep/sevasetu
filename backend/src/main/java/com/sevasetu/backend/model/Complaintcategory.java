package com.sevasetu.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Complaintcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String categoryName;

    private String description;

    // This creates a Foreign Key link to the Department table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private department department;
}
