package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.Announcement;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findByCategoryIdInOrderByPostedAtDesc(Set<String> categoryIds);
    List<Announcement> findTop10ByDepartmentNameOrderByPostedAtDesc(String departmentName);
    List<Announcement> findByCategory_NameOrderByPostedAtDesc(String categoryName);
    boolean existsByUrl(String url);

    List<Announcement> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSummaryContainingIgnoreCase(
            String titleKeyword,
            String contentKeyword,
            String summaryKeyword
    );
}
