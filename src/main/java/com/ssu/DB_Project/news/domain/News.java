package com.ssu.DB_Project.news.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "News")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    private Long id;

    @Column(nullable = false)
    private String title; // 뉴스 제목

    @Column(columnDefinition = "TEXT")
    private String summary; // LLM 요약

    @Column(columnDefinition = "TEXT")
    private String description; // LLM 설명

    @Column(name = "source_url", nullable = false, length = 2048)
    private String sourceUrl; // 원문 출처 URL

    @Column(name = "published_at")
    private LocalDateTime publishedAt; // 발행일

    @Column(name = "source_name")
    private String sourceName; // 뉴스 출처 (예: '네이버 뉴스')
}
