package com.ssu.DB_Project.announcement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import com.ssu.DB_Project.announcement.domain.AnnouncementDepartment;
import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.dto.ProcessedAnnouncement;
import com.ssu.DB_Project.announcement.repository.AnnouncementCategoryRepository;
import com.ssu.DB_Project.announcement.repository.AnnouncementDepartmentRepository;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.chatbot.VectorIngestionService;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementCategoryRepository categoryRepository;
    private final AnnouncementDepartmentRepository departmentRepository;
    private final ChatLanguageModel chatModel;
    private final VectorIngestionService vectorIngestionService;

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Transactional
    public Announcement processAndSave(AnnouncementProcessRequest request) {

        String systemPrompt = """
            당신은 대학교 공지사항을 분석하고 구조화하는 AI 비서입니다.
            아래의 공지 원문을 읽고, 반드시 JSON 형식으로만 출력하세요.

            {
              "title": "...",
              "content": "...",
              "summary": "...",
              "source": "...",
              "originalId": "...",
              "status": "...",
              "postedAt": "YYYY-MM-DDTHH:MM:SS"
            }

            규칙:
            1. 설명, 주석, 기타 텍스트 없이 위 JSON만 출력합니다.
            2. 날짜가 있으면 ISO-8601(LocalDateTime) 형식(예: "2025-01-15T09:00:00")으로 변환합니다.
            3. 날짜를 찾을 수 없으면 postedAt에 null을 넣습니다.
            """;

        String prompt = systemPrompt + "\n\n공지 원문:\n" + request.originalText();

        String rawResponse = chatModel.generate(UserMessage.from(prompt))
                .content()
                .text();

        System.out.println("✅ Raw AI response (Announcement):\n" + rawResponse);

        ProcessedAnnouncement aiData;
        try {
            aiData = mapper.readValue(rawResponse, ProcessedAnnouncement.class);
        } catch (Exception e) {
            throw new RuntimeException("❌ Announcement LLM JSON 파싱 실패: " + e.getMessage() + "\n응답: " + rawResponse);
        }

        // 카테고리/부서 매핑
        AnnouncementCategory category = categoryRepository
                .findByName(request.categoryName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지 카테고리: " + request.categoryName()));

        AnnouncementDepartment department = departmentRepository
                .findByName(request.departmentName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지 부서: " + request.departmentName()));

        Announcement announcement = Announcement.builder()
                .id(aiData.originalId()) // originalId를 PK로 사용할 경우
                .source(aiData.source())
                .originalId(aiData.originalId())
                .category(category)
                .department(department)
                .title(aiData.title())
                .content(aiData.content())
                .summary(aiData.summary())
                .url(request.url())
                .postedAt(aiData.postedAt())
                .status(aiData.status())
                .build();

        Announcement saved = announcementRepository.save(announcement);

        // 벡터 DB 저장
        vectorIngestionService.embedAnnouncement(saved);

        return saved;
    }
}
