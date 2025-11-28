package com.ssu.DB_Project.program.repository;

import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.domain.ProgramCategory;
import com.ssu.DB_Project.user.domain.InterestField;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProgramCategoryRepository extends JpaRepository<ProgramCategory, String> {
    Optional<ProgramCategory> findByName(String name);

    List<ProgramCategory> findByNameIn(List<String> interestFieldName);
}
