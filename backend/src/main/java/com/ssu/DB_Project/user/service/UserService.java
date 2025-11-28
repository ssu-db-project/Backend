package com.ssu.DB_Project.user.service;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.dto.AnnouncementDto;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.domain.ProgramCategory;
import com.ssu.DB_Project.program.dto.ProgramDto;
import com.ssu.DB_Project.program.repository.ProgramCategoryRepository;
import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import com.ssu.DB_Project.announcement.repository.AnnouncementCategoryRepository;
import com.ssu.DB_Project.program.repository.ProgramRepository;
import com.ssu.DB_Project.user.domain.*;
import com.ssu.DB_Project.user.dto.LoginRequest;
import com.ssu.DB_Project.user.dto.UserInterestResponse;
import com.ssu.DB_Project.user.dto.UserInterestUpdateRequest;
import com.ssu.DB_Project.user.dto.UserProfileResponse;
import com.ssu.DB_Project.user.dto.UserRegisterRequest;
import com.ssu.DB_Project.user.dto.UserRegisterResponse;
import com.ssu.DB_Project.user.dto.UserUpdateRequest;
import com.ssu.DB_Project.user.repository.*;
import com.ssu.DB_Project.university.domain.Department;
import com.ssu.DB_Project.university.repository.DepartmentRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AnnouncementCategoryRepository announcementCategoryRepository;
    private final AnnouncementRepository announcementRepository;
    private final ProgramCategoryRepository programCategoryRepository;
    private final ProgramRepository programRepository;

    private final AnnouncementCategoryRepository categoryRepo;
    private final InterestFieldRepository interestFieldRepository;

    @Transactional
    public UserRegisterResponse registerUser(UserRegisterRequest dto) {
        // 아이디 중복 검증
        if (userRepository.existsById(dto.getId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        /// 비밀번호 일치 검증
        if (!dto.isPasswordMatching()) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 학과 조회
        Department department = departmentRepository.findByName(dto.getDepartment())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학과입니다."));

        // 사용자 엔티티 생성
        User user = User.builder()
            .id(dto.getId())
            .password(dto.getPassword())
            .name(dto.getName())
            .gender(dto.getGender())
            .militaryStatus(dto.getMilitaryStatus())
            .grade(dto.getGrade())
            .currentSemester(dto.getCurrentSemester())
            .department(department)
            .enrollmentStatus(dto.getEnrollmentStatus())
            .residence(dto.getResidence())
            .interestCategories(new HashSet<>())
            .interestFields(new HashSet<>())
            .interestProgramCategories(new HashSet<>())
            .build();

        // 공지사항 관심 카테고리 설정
        if (dto.getInterestAnnouncementCategoryName() != null && !dto.getInterestAnnouncementCategoryName().isEmpty()) {
            List<AnnouncementCategory> categories = announcementCategoryRepository
                .findByNameIn(dto.getInterestAnnouncementCategoryName());

            if (categories.size() != dto.getInterestAnnouncementCategoryName().size()) {
                throw new IllegalArgumentException("존재하지 않는 공지 카테고리가 포함되어 있습니다.");
            }

            for (AnnouncementCategory category : categories) {
                user.addInterestCategory(category);
            }
        }

        // 관심 키워드 설정
        if (dto.getInterestFieldName() != null && !dto.getInterestFieldName().isEmpty()) {
            List<InterestField> fields = interestFieldRepository
                .findByNameIn(dto.getInterestFieldName());

            if (fields.size() != dto.getInterestFieldName().size()) {
                throw new IllegalArgumentException("존재하지 않는 키워드가 포함되어 있습니다.");
            }

            for (InterestField field : fields) {
                user.addInterestField(field);
            }
        }
        //관심 비교과 설정
        if (dto.getInterestProgramCategoryName() != null && !dto.getInterestProgramCategoryName().isEmpty()) {
            List<ProgramCategory> categories = programCategoryRepository
                .findByNameIn(dto.getInterestProgramCategoryName());

            if (categories.size() != dto.getInterestProgramCategoryName().size()) {
                throw new IllegalArgumentException("존재하지 않는 비교과 카테고리가 포함되어 있습니다.");
            }

            for (ProgramCategory category : categories) {
                user.addInterestProgramCategory(category);
            }
        }

        // 사용자 저장
        User savedUser = userRepository.save(user);

        return UserRegisterResponse.builder()
            .id(savedUser.getId())
            .name(savedUser.getName())
            .gender(savedUser.getGender())
            .militaryStatus(savedUser.getMilitaryStatus())
            .grade(savedUser.getGrade())
            .currentSemester(savedUser.getCurrentSemester())
            .department(savedUser.getDepartment() != null ? savedUser.getDepartment().getName() : null)
            .enrollmentStatus(savedUser.getEnrollmentStatus())
            .residence(savedUser.getResidence())
            .build();
    }

        @Transactional(readOnly = true)
        public boolean checkIdDuplicate(String id) {
            return userRepository.existsById(id);
        }

    @Transactional
    public User login(LoginRequest request) {
        User user = userRepository.findById(request.id())
            .orElseThrow(()->new IllegalArgumentException("존재하지 않는 아이디입니다."));
        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return UserProfileResponse.from(user);
    }

    public UserInterestResponse getUserInterests(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // A. 관심 공지 카테고리 이름 추출
        // User -> UserInterestCategory -> AnnouncementCategory -> Name
        List<String> announcementInterests = user.getInterestCategories().stream()
            .map(uic -> uic.getCategory().getName())
            .collect(Collectors.toList());

        // B. 관심 분야(키워드) 이름 추출
        // User -> UserInterestField -> InterestField -> Name
        List<String> fieldInterests = user.getInterestFields().stream()
            .map(uif -> uif.getField().getName())
            .collect(Collectors.toList());

        // C. 관심 비교과 카테고리 이름 추출
        // User -> UserInterestProgramCategory -> ProgramCategory -> Name
        List<String> programInterests = user.getInterestProgramCategories().stream()
            .map(uipc -> uipc.getCategory().getName())
            .collect(Collectors.toList());

        return UserInterestResponse.builder()
            .interestAnnouncementCategoryName(announcementInterests)
            .interestFieldName(fieldInterests)
            .interestProgramCategoryName(programInterests)
            .build();
    }

    @Transactional
    public void updateUserProfile(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 값이 있는(null이 아닌) 경우에만 업데이트
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword());
        }
        if (request.getName() != null) user.setName(request.getName());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getMilitaryStatus() != null) user.setMilitaryStatus(request.getMilitaryStatus());
        if (request.getGrade() != null) user.setGrade(request.getGrade());
        if (request.getCurrentSemester() != null) user.setCurrentSemester(request.getCurrentSemester());
        if (request.getEnrollmentStatus() != null) user.setEnrollmentStatus(request.getEnrollmentStatus());
        if (request.getResidence() != null) user.setResidence(request.getResidence());

        // 학과 변경 로직 (이름으로 조회 후 변경)
        if (request.getDepartment() != null) {
            Department department = departmentRepository.findByName(request.getDepartment())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학과입니다: " + request.getDepartment()));
            user.setDepartment(department);
        }
    }
    @Transactional
    public void updateUserInterests(String userId, UserInterestUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        if (request.getInterestAnnouncementCategoryName() != null) {
            List<String> newNames = request.getInterestAnnouncementCategoryName();

            // 1. 삭제: 새 리스트에 없는 기존 항목 제거
            user.getInterestCategories().removeIf(existing ->
                !newNames.contains(existing.getCategory().getName()));

            // 2. 추가: 기존에 없는 새 항목만 추가
            // (이미 있는 건 건드리지 않음 -> DB 쿼리 절약 & 에러 방지)
            Set<String> existingNames = user.getInterestCategories().stream()
                .map(uic -> uic.getCategory().getName())
                .collect(Collectors.toSet());

            List<String> namesToAdd = newNames.stream()
                .filter(name -> !existingNames.contains(name))
                .toList();

            if (!namesToAdd.isEmpty()) {
                List<AnnouncementCategory> categoriesToAdd = announcementCategoryRepository
                    .findByNameIn(namesToAdd);
                categoriesToAdd.forEach(user::addInterestCategory);
            }
        }

        // B. 관심 키워드 수정
        if (request.getInterestFieldName() != null) {
            List<String> newNames = request.getInterestFieldName();

            // 1. 삭제
            user.getInterestFields().removeIf(existing ->
                !newNames.contains(existing.getField().getName()));

            // 2. 추가
            Set<String> existingNames = user.getInterestFields().stream()
                .map(uif -> uif.getField().getName())
                .collect(Collectors.toSet());

            List<String> namesToAdd = newNames.stream()
                .filter(name -> !existingNames.contains(name))
                .toList();

            if (!namesToAdd.isEmpty()) {
                List<InterestField> fieldsToAdd = interestFieldRepository
                    .findByNameIn(namesToAdd);
                fieldsToAdd.forEach(user::addInterestField);
            }
        }

        // C. 비교과 관심사 수정
        if (request.getInterestProgramCategoryName() != null) {
            List<String> newNames = request.getInterestProgramCategoryName();

            // 1. 삭제
            user.getInterestProgramCategories().removeIf(existing ->
                !newNames.contains(existing.getCategory().getName()));

            // 2. 추가
            Set<String> existingNames = user.getInterestProgramCategories().stream()
                .map(uipc -> uipc.getCategory().getName())
                .collect(Collectors.toSet());

            List<String> namesToAdd = newNames.stream()
                .filter(name -> !existingNames.contains(name))
                .toList();

            if (!namesToAdd.isEmpty()) {
                List<ProgramCategory> categoriesToAdd = programCategoryRepository
                    .findByNameIn(namesToAdd);
                categoriesToAdd.forEach(user::addInterestProgramCategory);
            }
        }

    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getAnnouncementsByUserInterest(String userId,String category) {

        // 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Set<String> categoryIds = user.getInterestCategories().stream()
            // 💡 [추가] 요청된 카테고리가 있다면, 그 이름과 일치하는 것만 남김
            .filter(uic -> {
                if (category == null || category.isBlank()) {
                    return true; // 파라미터 없으면 다 통과 (전체 탭)
                }
                return uic.getCategory().getName().equals(category); // 이름 같은 것만 통과
            })
            .map(uic -> uic.getCategory().getId())
            .collect(Collectors.toSet());

        // 3. (예외 처리) 만약 해당하는 카테고리가 하나도 없으면 빈 리스트 반환
        // 예: 유저가 '장학'을 구독 안 했는데 ?category=장학 으로 요청한 경우 -> 빈 화면
        if (categoryIds.isEmpty()) {
            return new ArrayList<>();
        }
        // 공지사항 조회
        List<Announcement> announcements =
            announcementRepository.findByCategoryIdInOrderByPostedAtDesc(categoryIds);

        // 엔티티 → DTO 변환
        return announcements.stream()
            .map(AnnouncementDto::from)
            .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ProgramDto> getProgramsByUserInterest(String userId, String category) {

        // 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Set<String> categoryIds = user.getInterestProgramCategories().stream()
            // 💡 [추가] 요청된 카테고리가 있다면, 그 이름과 일치하는 것만 남김
            .filter(uic -> {
                if (category == null || category.isBlank()) {
                    return true; // 파라미터 없으면 다 통과 (전체 탭)
                }
                return uic.getCategory().getName().equals(category); // 이름 같은 것만 통과
            })
            .map(uic -> uic.getCategory().getId())
            .collect(Collectors.toSet());

        // 3. (예외 처리) 만약 해당하는 카테고리가 하나도 없으면 빈 리스트 반환
        // 예: 유저가 '장학'을 구독 안 했는데 ?category=장학 으로 요청한 경우 -> 빈 화면
        if (categoryIds.isEmpty()) {
            return new ArrayList<>();
        }
        // 공지사항 조회
        List<Program> programs =
            programRepository.findByCategory_IdInOrderByCreatedAtDesc(categoryIds);

        // 엔티티 → DTO 변환
        return programs.stream()
            .map(ProgramDto::from)
            .collect(Collectors.toList());
    }
}
