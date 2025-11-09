package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, String> {
}
