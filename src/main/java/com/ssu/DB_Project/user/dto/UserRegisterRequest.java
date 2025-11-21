package com.ssu.DB_Project.user.dto;

import java.util.List;

public record UserRegisterRequest(
        String id,
        String password,
        String name,
        String gender,
        Boolean militaryStatus,
        Integer grade,
        Integer currentSemester,
        String departmentId,
        String enrollmentStatus,
        String residence,

        List<String> interestCategoryIds,
        List<String> interestFieldIds
) { }
