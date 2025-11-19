package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  AnnouncementCategoryRepository extends JpaRepository<AnnouncementCategory, String> {

}
