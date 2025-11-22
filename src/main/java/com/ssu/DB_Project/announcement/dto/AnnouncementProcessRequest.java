package com.ssu.DB_Project.announcement.dto;

import java.util.List;

public record AnnouncementProcessRequest(
        String originalText,
        String url,
        String categoryName,
        String departmentName,
        List<FileDto> files
) {
    public record FileDto(String fileName, String fileUrl) {}
}
