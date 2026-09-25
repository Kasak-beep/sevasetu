package com.sevasetu.backend.controller;

import com.sevasetu.backend.model.Complaint;
import com.sevasetu.backend.model.ComplaintStatus;
//import com.sevasetu.backend.repository.ComplaintRepository;
import com.sevasetu.backend.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*; //like-restcontroller-request-post-put etc
import java.util.*;

@RestController // means spring this class is restapi controller and look for post get put
@RequestMapping("/complaints") // common starting url for each endpoint
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/create")
    public String createComplaint(@Valid @RequestBody Complaint complaint) { // request-body==Take the JSON from the
                                                                             // request body and convert it into a Java
                                                                             // Complaint object.
        return complaintService.createComplaint(complaint);
    }

    @GetMapping("/ward/{wardId}")
    public List<Complaint> getComplaintsByWard(@PathVariable Long wardId) { // we use pathvariable to extract id from
                                                                            // the url directly
        return complaintService.getComplaintsByWard(wardId);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Complaint> getComplaintsByCitizen(@PathVariable Long citizenId) {
        return complaintService.getComplaintsByCitizen(citizenId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable @NonNull Long id,
            @RequestParam ComplaintStatus status) {
        return complaintService.updateComplaintStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable @NonNull Long id) {
        complaintService.deleteComplaint(id);
        return "Sucess:Complaint with Id" + id + "has been deleted.";

    }
}
