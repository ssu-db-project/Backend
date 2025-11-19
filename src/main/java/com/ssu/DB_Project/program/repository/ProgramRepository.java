package com.ssu.DB_Project.program.repository;

import com.ssu.DB_Project.program.domain.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, String> {

}
