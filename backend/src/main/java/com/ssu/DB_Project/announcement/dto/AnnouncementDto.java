package com.ssu.DB_Project.announcement.dto;

import com.ssu.DB_Project.announcement.domain.Announcement;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnnouncementDto {

    private Long id;

    private String title;
    private String content;
    private String summary;

    private String categoryName;
    private String departmentName;

    private String status;
    private String postedAt;
    private String url;

    public static AnnouncementDto from(Announcement announcement) {
        return AnnouncementDto.builder()
            .id(announcement.getId())
            .title(announcement.getTitle())
            .content(announcement.getContent())
            .summary(announcement.getSummary())
            .categoryName(announcement.getCategory() != null
                ? announcement.getCategory().getName()
                : null)
            .departmentName(announcement.getDepartmentName())
            .status(announcement.getStatus())
            .postedAt(announcement.getPostedAt().toString())
                .url(announcement.getUrl())
            .build();
    }
}

