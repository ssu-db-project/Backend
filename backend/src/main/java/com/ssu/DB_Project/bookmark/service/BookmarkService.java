package com.ssu.DB_Project.bookmark.service;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.bookmark.domain.Bookmark;
import com.ssu.DB_Project.bookmark.dto.BookmarkRequest;
import com.ssu.DB_Project.bookmark.dto.BookmarkResponse;
import com.ssu.DB_Project.bookmark.repository.BookmarkRepository;
import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.repository.ProgramRepository;
import com.ssu.DB_Project.user.domain.User;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final AnnouncementRepository announcementRepository;
    private final ProgramRepository programRepository;
    public void addBookmark(String userId, BookmarkRequest request) {
        // targetId가 숫자면 공지사항, 아니면 프로그램
        try {
            Long announcementId = Long.parseLong(request.getTargetId());

            // 중복 체크
            if (bookmarkRepository.existsByUserIdAndAnnouncementId(userId, announcementId)) {
                throw new IllegalArgumentException("이미 북마크한 공지사항입니다");
            }

            /*
            Announcement announcement = announcementRepository.findById(
                    String.valueOf(announcementId))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다"));

             */

            Announcement announcement = announcementRepository.findById(announcementId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다"));

            Bookmark bookmark = Bookmark.builder()
                .user(User.builder().id(userId).build())
                .announcement(announcement)
                .createdAt(LocalDateTime.now())
                .build();

            bookmarkRepository.save(bookmark);
        } catch (NumberFormatException e) {
            // 중복 체크
            if (bookmarkRepository.existsByUserIdAndProgramId(userId, request.getTargetId())) {
                throw new IllegalArgumentException("이미 북마크한 프로그램입니다");
            }

            Program program = programRepository.findById(request.getTargetId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로그램입니다"));

            Bookmark bookmark = Bookmark.builder()
                .user(User.builder().id(userId).build())
                .program(program)
                .createdAt(LocalDateTime.now())
                .build();

            bookmarkRepository.save(bookmark);
        }
    }

    public void deleteBookmark(String userId, String targetId) {
        // targetId가 숫자면 공지사항, 아니면 프로그램
        try {
            Long announcementId = Long.parseLong(targetId);
            bookmarkRepository.deleteByUserIdAndAnnouncementId(userId, announcementId);
        } catch (NumberFormatException e) {
            bookmarkRepository.deleteByUserIdAndProgramId(userId, targetId);
        }
    }

    public List<BookmarkResponse> getBookmarks(String userId) {
        return bookmarkRepository.findByUserId(userId).stream()
            .map(BookmarkResponse::from)
            .collect(Collectors.toList());
    }
}