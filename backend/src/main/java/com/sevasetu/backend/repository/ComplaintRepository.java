package com.sevasetu.backend.repository;

import com.sevasetu.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.sevasetu.backend.model.ComplaintStatus;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Spring Data JPA gives us .save(), .findById(), .findAll(), etc. for free!
    List<Complaint> findByWardId(Long wardId);

    List<Complaint> findByCitizenId(Long citizenId);

    // 'status' is a direct enum field in Complaint, so no underscore needed
    List<Complaint> findByStatus(ComplaintStatus status);

    // Combining ward relationship ID and status
    List<Complaint> findByWardIdAndStatus(Long wardId, ComplaintStatus status);

}// SELECT * FROM complaints
 // WHERE ward_id = ?
 // AND status = ?;