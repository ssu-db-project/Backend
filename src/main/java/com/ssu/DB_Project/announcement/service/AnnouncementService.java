package com.ssu.DB_Project.announcement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.domain.AnnouncementCategory;
import com.ssu.DB_Project.announcement.domain.AnnouncementDepartment;
import com.ssu.DB_Project.announcement.domain.AnnouncementFile;
import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.dto.ProcessedAnnouncement;
import com.ssu.DB_Project.announcement.repository.AnnouncementCategoryRepository;
import com.ssu.DB_Project.announcement.repository.AnnouncementDepartmentRepository;
import com.ssu.DB_Project.announcement.repository.AnnouncementFileRepository;
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
    private final AnnouncementFileRepository announcementFileRepository;
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

        Announcement announcement = Announcement.builder()
                .source(aiData.source())
                .category(category)
                .departmentName(request.departmentName())
                .title(aiData.title())
                .content(aiData.content())
                .summary(aiData.summary())
                .url(request.url())
                .postedAt(aiData.postedAt())
                .status(aiData.status())
                .build();

        Announcement saved = announcementRepository.save(announcement);
        // 5. 💡 [추가] 첨부파일 저장 로직
        if (request.files() != null && !request.files().isEmpty()) {
            for (AnnouncementProcessRequest.FileDto fileDto : request.files()) {

                // 파일 엔티티 생성
                AnnouncementFile fileEntity = AnnouncementFile.builder()
                    .announcement(saved)    // 연관관계 설정
                    .fileName(fileDto.fileName())
                    .fileUrl(fileDto.fileUrl())
                    .build();

                announcementFileRepository.save(fileEntity);
            }
        }
        // 벡터 DB 저장
        vectorIngestionService.embedAnnouncement(saved);

        return saved;
    }
    @Transactional
    public Announcement processAndSave2(AnnouncementProcessRequest request) {

        // ---------------------------------------------------------
        // 🛑 [TEST MODE] AI 분석 로직 주석 처리 (API 비용 절약 & DB 테스트 집중)
        // ---------------------------------------------------------
        /*
        String systemPrompt = "...";
        String prompt = systemPrompt + "\n\n공지 원문:\n" + request.content();
        String rawResponse = chatModel.generate(UserMessage.from(prompt)).content().text();
        ProcessedAnnouncement aiData = mapper.readValue(rawResponse, ProcessedAnnouncement.class);
        */
        System.out.println("🚧 [TEST] AI 분석을 건너뛰고 임의의 값을 사용합니다.");

        // 1. 카테고리 매핑 (DB에 '학사', '장학' 등이 미리 들어가 있어야 함)
        AnnouncementCategory category = categoryRepository
            .findByName(request.categoryName())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지 카테고리: " + request.categoryName()));

        // 2. 공지사항 엔티티 생성 (임의 값 주입)
        Announcement announcement = Announcement.builder()
            .source("테스트 출처")               // aiData.source() 대신 임의 값
            .category(category)
            .departmentName("테스트 부서")       // request.departmentName() 대신 임의 값 가능
            .title("DB 저장 테스트 제목입니다")    // aiData.title() 대신 임의 값
            .content("DB 저장이 잘 되는지 확인하는 본문 내용입니다.") // aiData.content() 대신 임의 값
            .summary("테스트 요약입니다.")        // aiData.summary() 대신 임의 값

            // 💡 URL은 Unique 제약조건이 있으므로, 테스트할 때마다 충돌나지 않게 랜덤값 추가
            .url(request.url() + "?test=" + java.util.UUID.randomUUID().toString().substring(0, 5))

            .postedAt(java.time.LocalDateTime.now()) // 현재 시간
            .status("진행")
            .build();

        // 3. MySQL 저장 (부모 테이블)
        Announcement saved = announcementRepository.save(announcement);
        System.out.println("💾 [MySQL] 공지사항 저장 성공! ID: " + saved.getId());

        // 4. 첨부파일 저장 (자식 테이블)
        if (request.files() != null && !request.files().isEmpty()) {
            for (AnnouncementProcessRequest.FileDto fileDto : request.files()) {
                AnnouncementFile fileEntity = AnnouncementFile.builder()
                    .announcement(saved)
                    .fileName(fileDto.fileName())
                    .fileUrl(fileDto.fileUrl())
                    .build();

                announcementFileRepository.save(fileEntity);
                System.out.println("   📎 [MySQL] 파일 저장 성공: " + fileDto.fileName());
            }
        }

        // 5. 벡터 DB 저장 (주석 처리 유지)
        // vectorIngestionService.embedAnnouncement(saved);
        System.out.println("⏩ [Pass] 벡터 DB 저장은 건너뜁니다.");

        return saved;
    }

}
