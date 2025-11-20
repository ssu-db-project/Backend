package com.ssu.DB_Project.user.service;

import com.ssu.DB_Project.user.domain.enums.EnrollmentStatus;
import com.ssu.DB_Project.user.domain.enums.Gender;
import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import com.ssu.DB_Project.announcement.repository.AnnouncementCategoryRepository;
import com.ssu.DB_Project.user.domain.*;
import com.ssu.DB_Project.user.dto.UserRegisterRequest;
import com.ssu.DB_Project.user.repository.*;
import com.ssu.DB_Project.university.domain.Department;
import com.ssu.DB_Project.university.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final DepartmentRepository deptRepo;

    private final AnnouncementCategoryRepository categoryRepo;
    private final InterestFieldRepository interestFieldRepo;

    @Transactional
    public User registerUser(UserRegisterRequest request) {

        // 1) 학과 조회
        Department dept = deptRepo.findById(request.departmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // 2) User 생성
        User user = User.builder()
                .id(request.id())
                .password(request.password())
                .name(request.name())
                .gender(Gender.valueOf(request.gender()))
                .militaryStatus(request.militaryStatus())
                .grade(request.grade().shortValue())
                .currentSemester(request.currentSemester().shortValue())
                .department(dept)
                .enrollmentStatus(EnrollmentStatus.valueOf(request.enrollmentStatus()))
                .residence(request.residence())
                .build();

        // 3) 관심 카테고리 추가
        if (request.interestCategoryIds() != null) {
            for (String cid : request.interestCategoryIds()) {
                AnnouncementCategory cat = categoryRepo.findById(cid)
                        .orElseThrow(() -> new RuntimeException("Category not found: " + cid));
                user.addInterestCategory(cat);  // 매핑 엔티티 자동 생성
            }
        }

        // 4) 관심 분야 추가
        if (request.interestFieldIds() != null) {
            for (String fid : request.interestFieldIds()) {
                InterestField field = interestFieldRepo.findById(fid)
                        .orElseThrow(() -> new RuntimeException("InterestField not found: " + fid));
                user.addInterestField(field);
            }
        }

        // 5) 저장
        return userRepo.save(user);
    }
}
