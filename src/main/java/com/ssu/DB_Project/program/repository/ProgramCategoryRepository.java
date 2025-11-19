package com.ssu.DB_Project.program.repository;

import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.domain.ProgramCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramCategoryRepository extends JpaRepository<ProgramCategory, String> {

}
