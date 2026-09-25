package com.sevasetu.backend.repository;

import com.sevasetu.backend.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {
    // Allows us to search for a ward by its ward number easily
    Optional<Ward> findByWardNumber(String wardNumber);
}