package com.ssu.DB_Project.announcement.dto;

import java.time.LocalDateTime;

// LLM이 JSON으로 반환할 구조
public record ProcessedAnnouncement(
        String title,
        String content,
        String summary,
<<<<<<< HEAD:backend/src/main/java/com/ssu/DB_Project/announcement/dto/ProcessedAnnouncement.java
        //String source,
=======
//        String source,
        String originalId,
>>>>>>> ccb29fab (program_organization deleted):src/main/java/com/ssu/DB_Project/announcement/dto/ProcessedAnnouncement.java
        String status,
        LocalDateTime postedAt
) {}
