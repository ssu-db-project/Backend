package com.ssu.DB_Project.program.dto;

import java.time.LocalDateTime;

// LLM이 JSON으로 반환할 구조
public record ProcessedProgram(
        String title,
        String subtitle,
        String content,
        String targetAudience,
<<<<<<< HEAD:backend/src/main/java/com/ssu/DB_Project/program/dto/ProcessedProgram.java
//        String categoryName,
//        String organizationName,
=======
        String organizationName,
>>>>>>> ccb29fab (program_organization deleted):src/main/java/com/ssu/DB_Project/program/dto/ProcessedProgram.java
        String operationMethod,
        String location,
        Integer capacity,
        LocalDateTime applyStartAt,
        LocalDateTime applyEndAt,
        LocalDateTime programStartAt,
        LocalDateTime programEndAt
) {}
