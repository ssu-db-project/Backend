package com.ssu.DB_Project.user.dto;

import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import java.util.List;

public record UserCreateRequest(
        String id,
        String password,
        String name,
        Gender gender,
        Boolean militaryStatus,
        Short grade,
        Short currentSemester,
        String departmentId,
        EnrollmentStatus enrollmentStatus,
        String residence,
        List<String> interestCategoryIds,
        List<String> interestFieldIds
) {}
