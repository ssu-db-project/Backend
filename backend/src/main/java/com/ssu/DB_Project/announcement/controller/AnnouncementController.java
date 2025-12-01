package com.ssu.DB_Project.announcement.controller;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.dto.AnnouncementChatRequest;
import com.ssu.DB_Project.announcement.dto.AnnouncementResponse;
import com.ssu.DB_Project.announcement.service.AnnouncementService;
import com.ssu.DB_Project.announcement.service.AnnouncementChatService;
import com.ssu.DB_Project.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcement")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final AnnouncementChatService announcementChatService;

    @PostMapping("/process")
    public ResponseEntity<Announcement> processAnnouncement(@RequestBody AnnouncementProcessRequest request) {
        Announcement saved = announcementService.processAndSave(request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/chat/ask")
    public ResponseEntity<String> chat(@RequestBody AnnouncementChatRequest request) {
        String answer = announcementChatService.ask(request.userId(), request.question());
        return ResponseEntity.ok(answer);
    }
    // 공지사항 단건 조회
    @GetMapping("/{announcementId}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getAnnouncement(
        @PathVariable Long announcementId) {
        AnnouncementResponse announcementResponse = announcementService.getAnnouncement(announcementId);
        return ResponseEntity.ok(ApiResponse.success("공지사항 단건 조회가 완료되었습니다.",announcementResponse));
    }
}
