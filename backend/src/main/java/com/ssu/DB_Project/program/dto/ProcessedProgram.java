package com.ssu.DB_Project.program.dto;

import java.time.LocalDateTime;

// LLM이 JSON으로 반환할 구조
public record ProcessedProgram(
        String title,
        String subtitle,
        String content,
        String targetAudience,
//        String categoryName,
//        String organizationName,
        String operationMethod,
        String location,
        Integer capacity,
        LocalDateTime applyStartAt,
        LocalDateTime applyEndAt,
        LocalDateTime programStartAt,
        LocalDateTime programEndAt
) {}
