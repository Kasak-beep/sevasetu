package com.sevasetu.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity // this is not a normal class but a database table
@Table(name = "wards") // this is the name of the table in the database
@Getter // this is for get method
@Setter // this is for set method
@NoArgsConstructor // no argument constructor
@AllArgsConstructor // constructor with all arguments

public class Ward {
    @Id // this is the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // this is the auto increment of the primary key
    private Long id;

    @Column(nullable = false, unique = true) // this cant be null and should be unique
    private String wardNumber;

    @Column(nullable = false) // this cant be null
    private String wardName;

}
