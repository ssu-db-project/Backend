package com.ssu.DB_Project.announcement.dto;

public record AnnouncementProcessRequest(
        String originalText,
        String url,
        String categoryName,
        String departmentName
) {}
