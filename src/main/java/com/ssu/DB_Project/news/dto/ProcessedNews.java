package com.ssu.DB_Project.news.dto;

import java.time.LocalDateTime;

// AI에게 이 구조에 맞춰 응답을 생성하라고 요청할 DTO
public record ProcessedNews(
        String title,           // 뉴스 제목
        String summary,         // LLM 요약
        String description,     // LLM 설명 (요약보다 상세하게)
        LocalDateTime publishedAt, // 발행일 (YYYY-MM-DDTHH:MM:SS 형식)
        String sourceName      // 뉴스 출처 (예: '연합뉴스', '중앙일보')
) {}