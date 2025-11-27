package com.ssu.DB_Project.user.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInterestResponse {

    // 관심 공지 카테고리 이름 리스트
    private List<String> interestAnnouncementCategoryName;

    // 관심 키워드 이름 리스트
    private List<String> interestFieldName;

    // 관심 비교과 카테고리 이름 리스트
    private List<String> interestProgramCategoryName;
}
