package com.sevasetu.backend.repository;

import com.sevasetu.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Spring Data JPA gives us .save(), .findById(), .findAll(), etc. for free!
    List<Complaint> findByWardId(Long wardId);

    List<Complaint> findByCitizenId(Long citizenId);

}