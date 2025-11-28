package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {

    private String id;

    private String password;

    private String passwordConfirm;

    private String name;

    private Gender gender;

    private Boolean militaryStatus;

    private Short grade;

    private Short currentSemester;

    private String department;

    private EnrollmentStatus enrollmentStatus;

    private String residence;

    // 관심 공지 카테고리 리스트
    private List<String> interestAnnouncementCategoryName;

    // 관심 키워드 리스트
    private List<String> interestFieldName;

    //관심 비교과 카테고리 리스트
    private List<String> interestProgramCategoryName;
    // 비밀번호 일치 확인 메서드
    public boolean isPasswordMatching() {
        return password != null && password.equals(passwordConfirm);
    }
}
