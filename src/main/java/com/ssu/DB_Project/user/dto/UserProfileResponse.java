package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.User;
import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private String id;

    private String name;

    private Gender gender;

    private Boolean militaryStatus;

    private Short grade;

    private Short currentSemester;

    private String department; // 학과명 (String)

    private EnrollmentStatus enrollmentStatus;

    private String residence;

    // 엔티티 -> DTO 변환 메서드
    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .gender(user.getGender())
            .militaryStatus(user.getMilitaryStatus())
            .grade(user.getGrade())
            .currentSemester(user.getCurrentSemester())
            .department(user.getDepartment() != null ? user.getDepartment().getName() : null)
            .enrollmentStatus(user.getEnrollmentStatus())
            .residence(user.getResidence())
            .build();
    }
}
