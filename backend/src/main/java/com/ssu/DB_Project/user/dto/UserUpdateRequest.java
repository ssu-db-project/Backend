package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateRequest {
    private String password; // 비밀번호 변경 시
    private String name;
    private Gender gender;
    private Boolean militaryStatus;
    private Short grade;
    private Short currentSemester;
    private String department; // 학과 이름 (수정 시 DB 조회 필요)
    private EnrollmentStatus enrollmentStatus;
    private String residence;
}
