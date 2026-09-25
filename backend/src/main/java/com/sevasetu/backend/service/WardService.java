package com.sevasetu.backend.service;
import com.sevasetu.backend.model.Ward;
import com.sevasetu.backend.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class WardService {

    


    @Autowired
    public WardRepository WardRepository;

    public Ward createWard(Ward ward){

        if(WardRepository.findByWardNumber(ward.getWardNumber()).isPresent()){
            throw new RuntimeException("Ward number already exists!.");

        }
        return WardRepository.save(ward);
    }

    public List<Ward> getAllWard(){
        return WardRepository.findAll();
    }

}

