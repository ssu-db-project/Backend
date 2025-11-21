package com.ssu.DB_Project.program.repository;

import com.ssu.DB_Project.program.domain.ProgramOrganization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProgramOrganizationRepository extends JpaRepository<ProgramOrganization, String> {
    Optional<ProgramOrganization> findByName(String name);
}
