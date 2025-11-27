package com.ssu.DB_Project.announcement.dto;

import java.time.LocalDateTime;

// LLM이 JSON으로 반환할 구조
public record ProcessedAnnouncement(
        String title,
        String content,
        String summary,
        //String source,
        String status,
        LocalDateTime postedAt
) {}
