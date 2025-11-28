package com.ssu.DB_Project.program.repository;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.program.domain.Program;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, String> {
    List<Program> findByCategory_IdInOrderByCreatedAtDesc(Set<String> categoryIds);
    boolean existsByOriginalUrl(String originalUrl);
}
