package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, String> {

}
