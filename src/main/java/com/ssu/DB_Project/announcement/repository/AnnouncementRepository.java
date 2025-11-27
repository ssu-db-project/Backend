package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findTop10ByCategoryIdInOrderByPostedAtDesc(List<String> categoryIds);

    List<Announcement> findTop10ByDepartmentNameOrderByPostedAtDesc(String departmentName);

}
