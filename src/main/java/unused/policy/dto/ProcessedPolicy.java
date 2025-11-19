package unused.policy.dto;

import java.time.LocalDate;

// AI가 반환할 DTO (Entity의 Java 필드명과 일치시킴)
public record ProcessedPolicy(
        String title,
        String summary3line,       // summary_3line -> summary3line
        String description,
        String sourceOrganization, // source_organization -> sourceOrganization

        // 필터 조건 (camelCase로 변경)
        Integer targetAgeMin,      // target_age_min -> targetAgeMin
        Integer targetAgeMax,      // target_age_max -> targetAgeMax
        String targetLocation,     // target_location -> targetLocation
        String targetJob,          // target_job -> targetJob
        String targetGender,       // target_gender -> targetGender

        // 날짜 (camelCase로 변경)
        LocalDate supportStartDate, // support_start_date -> supportStartDate
        LocalDate supportEndDate    // support_end_date -> supportEndDate
//        String supportStartDate,
//        String supportEndDate
) {}