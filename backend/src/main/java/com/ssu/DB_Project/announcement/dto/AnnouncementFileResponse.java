package com.ssu.DB_Project.announcement.dto;

import com.ssu.DB_Project.announcement.domain.AnnouncementFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementFileResponse {
    private Long id;
    private String fileUrl;
    private String fileName;

    public static AnnouncementFileResponse from(AnnouncementFile file) {
        return AnnouncementFileResponse.builder()
            .id(file.getId())
            .fileUrl(file.getFileUrl())
            .fileName(file.getFileName())
            .build();
    }
}
