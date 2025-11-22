package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface  AnnouncementCategoryRepository extends JpaRepository<AnnouncementCategory, String> {
    Optional<AnnouncementCategory> findByName(String name);
}
