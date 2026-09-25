package com.sevasetu.backend.controller;

import com.sevasetu.backend.service.WardService;
import com.sevasetu.backend.model.Ward;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/wards")
public class WardController {

    @Autowired
    private WardService wardService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Ward createWard(@Valid @RequestBody Ward ward) {
        return wardService.createWard(ward);
    }

    @GetMapping
    public List<Ward> getAllWard() {
        return wardService.getAllWard();
    }

}