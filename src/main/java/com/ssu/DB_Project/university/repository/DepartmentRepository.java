package com.ssu.DB_Project.university.repository;

import com.ssu.DB_Project.university.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, String> {

}
