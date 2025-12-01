package com.ssu.DB_Project.program.dto;

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
public class ProgramResponse {
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
    private String createdAt;

    public static ProgramResponse from(Program program) {
        return ProgramResponse.builder()
            .id(program.getId())
            .title(program.getTitle())
            .subtitle(program.getSubtitle())
            .categoryName(program.getCategory() != null ? program.getCategory().getName() : null)
            .organizationName(program.getOrganizationName())
            .operationMethod(program.getOperationMethod())
            .applyStartAt(String.valueOf(program.getApplyStartAt()))
            .applyEndAt(String.valueOf(program.getApplyEndAt()))
            .programStartAt(String.valueOf(program.getProgramStartAt()))
            .programEndAt(String.valueOf(program.getProgramEndAt()))
            .location(program.getLocation())
            .targetAudience(program.getTargetAudience())
            .capacity(program.getCapacity())
            .content(program.getContent())
            .originalUrl(program.getOriginalUrl())
            .createdAt(String.valueOf(program.getCreatedAt()))
            .build();
    }
}