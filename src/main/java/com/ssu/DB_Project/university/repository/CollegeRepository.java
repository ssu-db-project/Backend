package com.ssu.DB_Project.university.repository;

import com.ssu.DB_Project.university.domain.College;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollegeRepository extends JpaRepository<College, Long> {

}
