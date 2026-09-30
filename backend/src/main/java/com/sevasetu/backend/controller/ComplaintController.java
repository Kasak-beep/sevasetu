package com.sevasetu.backend.controller;

import com.sevasetu.backend.model.Complaint;
import com.sevasetu.backend.model.ComplaintStatus;
//import com.sevasetu.backend.repository.ComplaintRepository;
import com.sevasetu.backend.service.ComplaintService;
import com.sevasetu.backend.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*; //like-restcontroller-request-post-put etc
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController // means spring this class is restapi controller and look for post get put
@RequestMapping("/complaints") // common starting url for each endpoint
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestBody Complaint complaint,
            @RequestParam Long citizenId) {
        Complaint savedComplaint = complaintService.createComplaint(complaint, citizenId);
        return new ResponseEntity<>(savedComplaint, HttpStatus.CREATED);
    }

    @GetMapping("/ward/{wardId}")
    public List<Complaint> getByWard(@PathVariable Long wardId) {
        return complaintService.getComplaintsByWard(wardId);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Complaint> getComplaintsByCitizen(@PathVariable Long citizenId) {
        return complaintService.getComplaintsByCitizen(citizenId);
    }

    // PATCH /api/complaints/1/status?status=IN_PROGRESS
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam ComplaintStatus status) {

        return complaintService.updateComplaintStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return "Sucess:Complaint with Id" + id + "has been deleted.";

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/assign")
    public Complaint assignWorker(
            @PathVariable Long id,
            @RequestParam Long workerId) {

        return complaintService.assignWorkerToComplaint(id, workerId);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Complaint> createComplaintWithImage(
            @RequestPart("complaint") Complaint complaint,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long citizenId) {

        // If an image was uploaded, store it and attach its URL
        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(file);
            complaint.setPhotoUrl(fileUrl);
        }

        Complaint savedComplaint = complaintService.createComplaint(complaint, citizenId);
        return new ResponseEntity<>(savedComplaint, HttpStatus.CREATED);
    }
}
