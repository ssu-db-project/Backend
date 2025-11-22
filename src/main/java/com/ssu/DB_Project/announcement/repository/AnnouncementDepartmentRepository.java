package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.AnnouncementDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementDepartmentRepository extends JpaRepository<AnnouncementDepartment, String> {
    Optional<AnnouncementDepartment> findByName(String name);
}
