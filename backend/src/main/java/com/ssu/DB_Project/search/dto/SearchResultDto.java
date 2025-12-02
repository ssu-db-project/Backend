package com.ssu.DB_Project.search.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SearchResultDto {
    private String id;            // announcement_id 또는 program_id
    private String title;         // 제목
    private String type;          // "announcement" / "program"
    private String sourceContent; // 🔥 검색 근거가 된 내용 (LLM 이유 설명용)
    private double similarity;    // 매칭 점수
}
