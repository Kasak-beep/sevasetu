package com.sevasetu.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sevasetu.backend.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

}
