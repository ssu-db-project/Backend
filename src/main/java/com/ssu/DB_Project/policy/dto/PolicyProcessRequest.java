package com.ssu.DB_Project.policy.dto;

// 크롤러가 /api/process-policy로 보낼 JSON의 구조
public record PolicyProcessRequest(
        String originalText,  // 크롤링한 원문
        String sourceUrl      // 크롤링한 URL
) {}