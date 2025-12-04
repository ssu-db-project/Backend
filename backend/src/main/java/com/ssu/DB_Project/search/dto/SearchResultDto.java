package com.ssu.DB_Project.search.dto;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.program.domain.Program;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResultDto {
    private String id;
    private String title;
    private String type;
    private String sourceContent;
    private double similarity;

    private String originalUrl;

    public static SearchResultDto fromAnnouncement(Announcement a, double score) {
        return SearchResultDto.builder()
                .id(String.valueOf(a.getId()))
                .title(a.getTitle())
                .type("announcement")
                .sourceContent(a.getContent())
                .similarity(score)
                .originalUrl(a.getUrl())
                .build();
    }

    public static SearchResultDto fromProgram(Program p, double score) {
        return SearchResultDto.builder()
                .id(String.valueOf(p.getId()))
                .title(p.getTitle())
                .type("program")
                .sourceContent(p.getContent())
                .similarity(score)
                .originalUrl(p.getOriginalUrl())
                .build();
    }
}
