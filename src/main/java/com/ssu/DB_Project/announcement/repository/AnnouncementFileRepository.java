package com.ssu.DB_Project.announcement.repository;

import com.ssu.DB_Project.announcement.domain.AnnouncementFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementFileRepository extends JpaRepository<AnnouncementFile, String> {

}
