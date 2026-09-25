package com.sevasetu.backend.service;

import com.sevasetu.backend.model.Complaint;
import com.sevasetu.backend.model.ComplaintStatus;
import com.sevasetu.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<Complaint> getComplaintsByWard(Long wardId) {
        return complaintRepository.findByWardId(wardId);
    }

    public List<Complaint> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    public String createComplaint(Complaint complaint) {
        // 1. Ensure status starts as CREATED (just in case)
        complaint.setStatus(ComplaintStatus.CREATED);

        // 2. Ensure created time is stamped
        complaint.setCreatedAt(LocalDateTime.now());

        // 3. Tell the repository tool to save it to PostgreSQL
        complaintRepository.save(complaint);

        return "Success";
    }

    public Complaint updateComplaintStatus(@NonNull Long complaintId, ComplaintStatus newStatus) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        complaint.setStatus(newStatus);
        complaint.setUpdatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(@NonNull Long complaintId) {
        boolean exists = complaintRepository.existsById(complaintId);
        if (!exists) {
            throw new RuntimeException("Complaint not found" + complaintId);

        }
        complaintRepository.deleteById(complaintId);
    }

}
