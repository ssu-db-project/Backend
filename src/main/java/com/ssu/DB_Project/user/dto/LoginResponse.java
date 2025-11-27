package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.User;
import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String id;
    private String name;
    private Gender gender;
    private Boolean militaryStatus;
    private Short grade;
    private Short currentSemester;
    private String department;
    private EnrollmentStatus enrollmentStatus;
    private String residence;

    // 💡 [추가] 관심사 목록 (이름 리스트)
    private List<String> interestAnnouncementCategories; // 관심 공지 카테고리
    private List<String> interestFields;                 // 관심 분야 (키워드)
    private List<String> interestProgramCategories;      // 관심 비교과 카테고리

    private String message;

    public static LoginResponse from(User user) {
        return LoginResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .gender(user.getGender())
            .militaryStatus(user.getMilitaryStatus())
            .grade(user.getGrade())
            .currentSemester(user.getCurrentSemester())
            .department(user.getDepartment() != null ? user.getDepartment().getName() : null)
            .enrollmentStatus(user.getEnrollmentStatus())
            .residence(user.getResidence())

            // 💡 [추가] 엔티티 연결을 타고 들어가서 '이름'만 추출하여 리스트로 변환
            .interestAnnouncementCategories(
                user.getInterestCategories().stream()
                    .map(uic -> uic.getCategory().getName())
                    .collect(Collectors.toList())
            )
            .interestFields(
                user.getInterestFields().stream()
                    .map(uif -> uif.getField().getName())
                    .collect(Collectors.toList())
            )
            .interestProgramCategories(
                user.getInterestProgramCategories().stream()
                    .map(uipc -> uipc.getCategory().getName())
                    .collect(Collectors.toList())
            )

            .message("로그인이 완료되었습니다.")
            .build();
    }
}
