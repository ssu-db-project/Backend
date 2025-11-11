package com.ssu.DB_Project.policy.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id")
    private Long id;

    @Column(nullable = false)
    private String title; // 정책 제목

    @Column(name = "summary_3line", columnDefinition = "TEXT")
    private String summary3line; // 세줄 요약

    @Column(columnDefinition = "TEXT")
    private String description; // 설명 (LLM 가공)

    @Column(name = "original_text", columnDefinition = "TEXT")
    private String originalText; // 원문

    @Column(name = "source_url", nullable = false, length = 2048)
    private String sourceUrl; // 출처 URL

    @Column(name = "source_organization")
    private String sourceOrganization; // 제공 기관

    @UpdateTimestamp // 크롤링으로 데이터 갱신 시 자동으로 시간 기록
    @Column(name = "last_crawled_at")
    private LocalDateTime lastCrawledAt; // 데이터 수집/갱신일

    // --- 맞춤형 추천 필터 조건 ---

    @Column(name = "target_age_min")
    private Integer targetAgeMin;

    @Column(name = "target_age_max")
    private Integer targetAgeMax;

    @Column(name = "target_location")
    private String targetLocation;

    @Column(name = "target_job")
    private String targetJob;

    @Column(name = "target_gender")
    private String targetGender;

    // --- 지원 기간 ---
    @Column(name = "support_start_date")
    private LocalDate supportStartDate; // 지원 시작일

    @Column(name = "support_end_date")
    private LocalDate supportEndDate; // 지원 종료일
}
