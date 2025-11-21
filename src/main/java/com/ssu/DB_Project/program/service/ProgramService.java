package com.ssu.DB_Project.program.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ssu.DB_Project.chatbot.VectorIngestionService;
import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.domain.ProgramCategory;
import com.ssu.DB_Project.program.domain.ProgramOrganization;
import com.ssu.DB_Project.program.dto.ProcessedProgram;
import com.ssu.DB_Project.program.dto.ProgramProcessRequest;
import com.ssu.DB_Project.program.repository.ProgramCategoryRepository;
import com.ssu.DB_Project.program.repository.ProgramOrganizationRepository;
import com.ssu.DB_Project.program.repository.ProgramRepository;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final ProgramCategoryRepository categoryRepository;
    private final ProgramOrganizationRepository organizationRepository;
    private final ChatLanguageModel chatModel;
    private final VectorIngestionService vectorIngestionService;

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Transactional
    public Program processAndSave(ProgramProcessRequest request) {

        String systemPrompt = """
            당신은 대학교 비교과/프로그램 공지를 분석하고 구조화하는 AI 비서입니다.
            아래 프로그램 원문을 읽고 반드시 JSON 형식으로만 출력하세요.

            {
              "title": "...",
              "subtitle": "...",
              "content": "...",
              "targetAudience": "...",
              "operationMethod": "...",
              "location": "...",
              "capacity": 0,
              "applyStartAt": "YYYY-MM-DDTHH:MM:SS",
              "applyEndAt": "YYYY-MM-DDTHH:MM:SS",
              "programStartAt": "YYYY-MM-DDTHH:MM:SS",
              "programEndAt": "YYYY-MM-DDTHH:MM:SS"
            }

            규칙:
            1. 위 JSON 이외의 텍스트는 절대 출력하지 마세요.
            2. 날짜가 있으면 ISO-8601(LocalDateTime) 형식(예: "2025-01-01T09:00:00")으로 변환합니다.
            3. 찾을 수 없는 날짜는 null 값을 사용합니다.
            """;

        String prompt = systemPrompt + "\n\n프로그램 원문:\n" + request.originalText();

        String rawResponse = chatModel.generate(UserMessage.from(prompt))
                .content()
                .text();

        System.out.println("✅ Raw AI response (Program):\n" + rawResponse);

        ProcessedProgram aiData;
        try {
            aiData = mapper.readValue(rawResponse, ProcessedProgram.class);
        } catch (Exception e) {
            throw new RuntimeException("❌ Program LLM JSON 파싱 실패: " + e.getMessage() + "\n응답: " + rawResponse);
        }

        ProgramCategory category = categoryRepository.findByName(request.categoryName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로그램 카테고리: " + request.categoryName()));

        ProgramOrganization organization = organizationRepository.findByName(request.organizationName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로그램 기관: " + request.organizationName()));

        Program program = Program.builder()
                .id(generateProgramId())  // 크롤러에서 id를 줄 거면 그걸 쓰고, 아니면 별도 전략 사용
                .title(aiData.title())
                .subtitle(aiData.subtitle())
                .category(category)
                .organization(organization)
                .operationMethod(aiData.operationMethod())
                .applyStartAt(aiData.applyStartAt())
                .applyEndAt(aiData.applyEndAt())
                .programStartAt(aiData.programStartAt())
                .programEndAt(aiData.programEndAt())
                .location(aiData.location())
                .targetAudience(aiData.targetAudience())
                .capacity(aiData.capacity())
                .content(aiData.content())
                .originalUrl(request.url())
                .build();

        Program saved = programRepository.save(program);

        vectorIngestionService.embedProgram(saved);

        return saved;
    }

    // TODO: 실제 ID 생성 전략 (원본 페이지의 ID 등)을 크롤러와 합의해서 결정
    private String generateProgramId() {
        return "prg_" + System.currentTimeMillis();
    }
}
