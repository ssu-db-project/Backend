package com.ssu.DB_Project.program.dto;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.dto.AnnouncementDto;
import com.ssu.DB_Project.program.domain.Program;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramDto {

    private String id;

    private String title;
    private String subtitle;

    private String categoryName;
    private String organizationName;

    private String operationMethod;

    private String applyStartAt;
    private String applyEndAt;
    private String programStartAt;
    private String programEndAt;

    private String location;
    private String targetAudience;
    private Integer capacity;
    private String content;
    private String originalUrl;

    // 엔티티 -> DTO 변환 메서드 (Static Factory Method)
    public static ProgramDto from(Program program) {
        return ProgramDto.builder()
            .id(program.getId())
            .title(program.getTitle())
            .subtitle(program.getSubtitle())
            // 카테고리가 null일 경우 안전하게 처리
            .categoryName(program.getCategory() != null ? program.getCategory().getName() : null)
            .organizationName(program.getOrganizationName())
            .operationMethod(program.getOperationMethod())
            .applyStartAt(program.getApplyStartAt().toString())
            .applyEndAt(program.getApplyEndAt().toString())
            .programStartAt(program.getProgramStartAt().toString())
            .programEndAt(program.getProgramEndAt().toString())
            .location(program.getLocation())
            .targetAudience(program.getTargetAudience())
            .capacity(program.getCapacity())
            .content(program.getContent())
            .originalUrl(program.getOriginalUrl())
            .build();
    }
}
