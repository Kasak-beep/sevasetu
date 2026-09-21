package com.sevasetu.backend.repository;

import com.sevasetu.backend.model.Complaint;
import com.sevasetu.backend.model.Complaintcategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaintcategory, Long> {
    List<Complaint> findByCitizenId(Long citizenId);

    List<Complaint> findByStatus(String status);

}
