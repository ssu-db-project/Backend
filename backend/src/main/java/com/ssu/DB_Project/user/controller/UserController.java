package com.ssu.DB_Project.user.controller;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.dto.AnnouncementDto;
import com.ssu.DB_Project.common.ApiResponse;
import com.ssu.DB_Project.program.dto.ProgramDto;
import com.ssu.DB_Project.user.domain.User;
import com.ssu.DB_Project.user.dto.LoginRequest;
import com.ssu.DB_Project.user.dto.LoginResponse;
import com.ssu.DB_Project.user.dto.UserInterestResponse;
import com.ssu.DB_Project.user.dto.UserInterestUpdateRequest;
import com.ssu.DB_Project.user.dto.UserProfileResponse;
import com.ssu.DB_Project.user.dto.UserRegisterRequest;
import com.ssu.DB_Project.user.dto.UserRegisterResponse;
import com.ssu.DB_Project.user.dto.UserUpdateRequest;
import com.ssu.DB_Project.user.repository.UserRepository;
import com.ssu.DB_Project.user.service.UserService;
import dev.langchain4j.service.V;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserRegisterResponse>> register(@RequestBody UserRegisterRequest request) {
        UserRegisterResponse response = userService.registerUser(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.",response));
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest){
        User user = userService.login(request);
        HttpSession session = httpRequest.getSession();
        session.setAttribute("loginUser", user);
        session.setMaxInactiveInterval(3600);
        LoginResponse response= LoginResponse.from(user);
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.",response));
    }
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponse.success("로그아웃이 완료되었습니다.")); // 200 OK
    }
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(HttpServletRequest request) {
        String userId = getLoginUserId(request);
        UserProfileResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interests")
    public ResponseEntity<UserInterestResponse> getMyInterests(HttpServletRequest request) {
        String userId = getLoginUserId(request);
        UserInterestResponse response = userService.getUserInterests(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody UserUpdateRequest request, HttpServletRequest httpRequest) {
        String userId = getLoginUserId(httpRequest);
        userService.updateUserProfile(userId, request);
        return ResponseEntity.ok("회원 정보가 성공적으로 수정되었습니다.");
    }

    @PutMapping("/interests")
    public ResponseEntity<String> updateInterests(@RequestBody UserInterestUpdateRequest request, HttpServletRequest httpRequest) {
        String userId = getLoginUserId(httpRequest);
        userService.updateUserInterests(userId, request);
        return ResponseEntity.ok("관심 분야가 성공적으로 수정되었습니다.");
    }

    @GetMapping("/interest-announcements")
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getInterestAnnouncements(
        HttpServletRequest request, @RequestParam(value = "category", required = false) String category) {

        String userId = getLoginUserId(request); // 세션에서 가져오기
        List<AnnouncementDto> response = userService.getAnnouncementsByUserInterest(userId,category);
        return ResponseEntity.ok(ApiResponse.success("사용자의 관심 공지사항을 조회합니다.",response));
    }

    @GetMapping("/interest-programs")
    public ResponseEntity<ApiResponse<List<ProgramDto>>> getInterestPrograms(
        HttpServletRequest request, @RequestParam(value = "category", required = false) String category) {
        String userId = getLoginUserId(request);
        List<ProgramDto> response = userService.getProgramsByUserInterest(userId,category);
        return ResponseEntity.ok(ApiResponse.success("사용자의 관심 비교과프로그램을 조회합니다.",response));
    }

    // 세션에서 ID 추출하는 헬퍼 메소드
    private String getLoginUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        // 세션에 저장된 객체가 User라고 가정
        User loginUser = (User) session.getAttribute("loginUser");
        return loginUser.getId();
    }

    @GetMapping("/check-duplicate/{userId}")
    public ResponseEntity<ApiResponse<Boolean>> checkDuplicateId(@PathVariable String userId) {
        if (userRepository.existsById(userId)) {
            return ResponseEntity.ok(ApiResponse.success("이미 사용 중인 아이디입니다.", true));
        }

        return ResponseEntity.ok(ApiResponse.success("사용 가능한 아이디입니다.", false));
    }

}
