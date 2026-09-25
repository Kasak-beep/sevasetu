package com.sevasetu.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sevasetu.backend.model.User;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

}
