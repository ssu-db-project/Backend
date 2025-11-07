package com.ssu.DB_Project.user.repository;

import com.ssu.DB_Project.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
