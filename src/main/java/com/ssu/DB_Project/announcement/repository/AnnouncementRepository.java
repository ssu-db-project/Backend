package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.Announcement;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findTop10ByCategoryIdInOrderByPostedAtDesc(List<String> categoryIds);

    List<Announcement> findTop10ByDepartmentIdInOrderByPostedAtDesc(List<String> departmentIds);
    List<Announcement> findByCategoryIdInOrderByPostedAtDesc(Set<String> categoryIds);
    List<Announcement> findByCategory_NameOrderByPostedAtDesc(String categoryName);
    boolean existsByUrl(String url);
}
