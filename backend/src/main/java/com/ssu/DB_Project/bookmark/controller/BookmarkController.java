package com.ssu.DB_Project.bookmark.controller;

import com.ssu.DB_Project.bookmark.dto.BookmarkRequest;
import com.ssu.DB_Project.bookmark.dto.BookmarkResponse;
import com.ssu.DB_Project.bookmark.service.BookmarkService;
import com.ssu.DB_Project.common.ApiResponse;
import com.ssu.DB_Project.user.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import retrofit2.http.Tag;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    // 즐겨찾기 추가
    @PostMapping("/bookmarks")
    public ResponseEntity<Void> addBookmark(
        @RequestBody BookmarkRequest request,
        HttpServletRequest httpRequest) {
        String userId = getUserIdFromSession(httpRequest);
        bookmarkService.addBookmark(userId, request);
        return ResponseEntity.ok().build();
    }

    // 즐겨찾기 삭제
    @DeleteMapping("/bookmarks/{targetId}")
    public ResponseEntity<Void> deleteBookmark(
        @PathVariable String targetId,
        HttpServletRequest httpRequest) {
        String userId = getUserIdFromSession(httpRequest);
        bookmarkService.deleteBookmark(userId, targetId);
        return ResponseEntity.ok().build();
    }

    // 즐겨찾기 목록 조회
    @GetMapping("/bookmarks")
    public ResponseEntity<List<BookmarkResponse>> getBookmarks(
        HttpServletRequest httpRequest) {
        String userId = getUserIdFromSession(httpRequest);
        return ResponseEntity.ok(bookmarkService.getBookmarks(userId));
    }

    private String getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new IllegalStateException("로그인이 필요합니다 (세션 만료)");
        }

        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalStateException("로그인이 필요합니다 (유저 정보 없음)");
        }

        // [수정 3] 객체에서 ID를 꺼내서 리턴
        return loginUser.getId();
    }
}
