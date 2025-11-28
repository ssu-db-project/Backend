package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterResponse {

    private String id;

    private String name;

    private Gender gender;

    private Boolean militaryStatus;

    private Short grade;

    private Short currentSemester;

    private String department;

    private EnrollmentStatus enrollmentStatus;

    private String residence;

}

