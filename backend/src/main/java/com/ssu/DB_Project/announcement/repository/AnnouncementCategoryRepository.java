package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface  AnnouncementCategoryRepository extends JpaRepository<AnnouncementCategory, String> {
    Optional<AnnouncementCategory> findByName(String name);
    List<AnnouncementCategory> findByNameIn(List<String> names);
}
