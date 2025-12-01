package com.ssu.DB_Project.bookmark.repository;

import com.ssu.DB_Project.bookmark.domain.Bookmark;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(String userId);
    Optional<Bookmark> findByUserIdAndAnnouncementId(String userId, Long announcementId);
    Optional<Bookmark> findByUserIdAndProgramId(String userId, String programId);
    boolean existsByUserIdAndAnnouncementId(String userId, Long announcementId);
    boolean existsByUserIdAndProgramId(String userId, String programId);

    void deleteByUserIdAndAnnouncementId(String userId, Long announcementId);
    void deleteByUserIdAndProgramId(String userId, String programId);
}
