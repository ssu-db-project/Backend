package com.ssu.DB_Project.user.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserInterestUpdateRequest {
    private List<String> interestAnnouncementCategoryName; // 공지 카테고리
    private List<String> interestFieldName;                // 키워드
    private List<String> interestProgramCategoryName;      // 비교과 카테고리
}
