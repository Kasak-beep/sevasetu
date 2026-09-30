package com.sevasetu.backend.service;

import com.sevasetu.backend.model.Complaint;
import com.sevasetu.backend.repository.UserRepository;
import com.sevasetu.backend.model.ComplaintStatus;
import com.sevasetu.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sevasetu.backend.model.User;
import com.sevasetu.backend.model.Ward;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Complaint> getComplaintsByWard(Long wardId) {
        return complaintRepository.findByWardId(wardId);
    }

    public List<Complaint> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    public Complaint createComplaint(Complaint complaint, Long citizenId) {
        // 1. Fetch the citizen submitting the complaint
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found with ID: " + citizenId));

        // 2. Attach the citizen to the complaint
        complaint.setCitizen(citizen);

        // 3. Automatically inherit the citizen's assigned Ward
        Ward citizenWard = citizen.getWard();
        if (citizenWard == null) {
            throw new RuntimeException("User is not assigned to any ward. Please verify ward mapping.");
        }
        complaint.setWard(citizenWard);

        // 4. Set initial status and creation/update timestamps
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        // 5. Save and return the saved complaint entity
        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus newStatus) {
        // 1. Find the existing complaint by its ID
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        // 2. Update its status
        complaint.setStatus(newStatus);

        // 3. Update the timestamp to show when it was last modified
        complaint.setUpdatedAt(LocalDateTime.now());

        // 4. Save and return the updated complaint
        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(Long complaintId) {
        boolean exists = complaintRepository.existsById(complaintId);
        if (!exists) {
            throw new RuntimeException("Complaint not found" + complaintId);

        }
        complaintRepository.deleteById(complaintId);
    }

    public Complaint assignWorkerToComplaint(Long complaintId, Long workerId) {
    // 1. Find the complaint by ID, or throw an exception if it doesn't exist
    Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

    // 2. Find the worker user by ID, or throw an exception if not found
    User worker = userRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found with ID: " + workerId));

    // 3. Assign the worker to the complaint
    complaint.setAssignedWorker(worker);

    // 4. Update the complaint status to ASSIGNED and refresh the timestamp
    complaint.setStatus(ComplaintStatus.ASSIGNED);
    complaint.setUpdatedAt(LocalDateTime.now());

    // 5. Save and return the updated complaint
    return complaintRepository.save(complaint);
}

}
