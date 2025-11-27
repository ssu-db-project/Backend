package com.ssu.DB_Project.program.dto;

public record ProgramProcessRequest(
        String originalText,
        String url,
        String category,
        String organizationName
) {}
