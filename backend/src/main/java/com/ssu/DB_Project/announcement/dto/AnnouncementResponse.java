package com.ssu.DB_Project.announcement.dto;

import com.ssu.DB_Project.announcement.domain.Announcement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String categoryName;
    private String departmentName;
    private String title;
    private String content;
    private String summary;
    private String url;
    private String postedAt;
    private String status;
    private String createdAt;
    private List<AnnouncementFileResponse> files;

    public static AnnouncementResponse from(Announcement announcement) {
        return AnnouncementResponse.builder()
            .id(announcement.getId())
            .categoryName(announcement.getCategory() != null
                ? announcement.getCategory().getName()
                : null)
            .departmentName(announcement.getDepartmentName())
            .title(announcement.getTitle())
            .content(announcement.getContent())
            .summary(announcement.getSummary())
            .url(announcement.getUrl())
            .postedAt(String.valueOf(announcement.getPostedAt()))
            .status(announcement.getStatus())
            .createdAt(String.valueOf(announcement.getCreatedAt()))
            .files(announcement.getFiles() != null ?
                announcement.getFiles().stream()
                    .map(AnnouncementFileResponse::from)
                    .collect(Collectors.toList()) :
                List.of())
            .build();
    }
}
