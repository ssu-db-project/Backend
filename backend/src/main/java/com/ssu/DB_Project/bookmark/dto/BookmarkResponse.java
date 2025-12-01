package com.ssu.DB_Project.bookmark.dto;

import com.ssu.DB_Project.bookmark.domain.Bookmark;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class BookmarkResponse {
    private Long id;
    private String targetType;
    private String targetId;
    private String title;
    private String createdAt;

    public static BookmarkResponse from(Bookmark bookmark) {
        if (bookmark.getAnnouncement() != null) {
            return BookmarkResponse.builder()
                .id(bookmark.getId())
                .targetType("ANNOUNCEMENT")
                .targetId(String.valueOf(bookmark.getAnnouncement().getId()))
                .title(bookmark.getAnnouncement().getTitle())
                .createdAt(String.valueOf(bookmark.getCreatedAt()))
                .build();
        } else {
            return BookmarkResponse.builder()
                .id(bookmark.getId())
                .targetType("PROGRAM")
                .targetId(bookmark.getProgram().getId())
                .title(bookmark.getProgram().getTitle())
                .createdAt(String.valueOf(bookmark.getCreatedAt()))
                .build();
        }
    }
}
