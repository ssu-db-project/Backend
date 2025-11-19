package com.ssu.DB_Project.policy.service;

import java.time.LocalDate;
import dev.langchain4j.model.chat.ChatLanguageModel;
import com.ssu.DB_Project.chatbot.VectorIngestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ssu.DB_Project.policy.domain.Policy;
import com.ssu.DB_Project.policy.dto.PolicyProcessRequest;
import com.ssu.DB_Project.policy.dto.ProcessedPolicy;
import com.ssu.DB_Project.policy.repository.PolicyRepository;
import dev.langchain4j.data.message.UserMessage;
//import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PolicyService {

    private final VectorIngestionService vectorIngestionService;
    private final PolicyRepository policyRepository;
    private final ChatLanguageModel chatModel;
    //private final OpenAiChatModel openAiModel;
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public PolicyService(
            PolicyRepository policyRepository,
            VectorIngestionService vectorIngestionService,
            ChatLanguageModel chatModel
    ) {
        this.policyRepository = policyRepository;
        this.vectorIngestionService = vectorIngestionService;
        this.chatModel = chatModel;
    }

    @Transactional
    public Policy processAndSave(PolicyProcessRequest request) {

        // AI 프롬프트 구성
        String systemPrompt = """
            당신은 정부 정책을 분석하고 구조화하는 AI 정책 요약가입니다.
            아래 정책 원문을 분석하여 반드시 JSON 형식으로만 출력하세요.
            절대 설명이나 문장은 넣지 마세요.

            {
              "title": "...",
              "summary3line": "...",
              "description": "...",
              "sourceOrganization": "...",
              "targetAgeMin": 0,
              "targetAgeMax": 0,
              "targetLocation": "...",
              "targetJob": "...",
              "targetGender": "...",
              "supportStartDate": null,  
              "supportEndDate": null     
            }

            규칙:
            1. 설명이나 여분의 텍스트 없이, 반드시 위 JSON 구조만 출력하세요.
            2. 원문에서 실제 날짜(예: "2024년 10월 30일")를 찾은 경우에만 "YYYY-MM-DD" 형식으로 변환하여 출력하세요.
            3. 원문에서 날짜 정보를 찾을 수 없는 경우, "YYYY-MM-DD" 같은 플레이스홀더 대신 반드시 JSON null 값을 사용하세요.
            """;

        String prompt = systemPrompt + "\n\n정책 원문:\n" + request.originalText();

        // LLM 호출
        String rawResponse = chatModel.generate(UserMessage.from(prompt))
                .content()
                .text();


        System.out.println("✅ Raw AI response (Policy):\n" + rawResponse);

        // JSON → ProcessedPolicy 매핑
        ProcessedPolicy aiData;
        try {
            aiData = mapper.readValue(rawResponse, ProcessedPolicy.class);
        } catch (Exception e) {
            throw new RuntimeException("❌ LLM JSON 파싱 실패: " + e.getMessage() + "\n응답 내용: " + rawResponse);
        }


        // DTO → Entity 변환 후 DB 저장
        Policy policy = new Policy();
        policy.setTitle(aiData.title());
        policy.setSummary3line(aiData.summary3line());
        policy.setDescription(aiData.description());
        policy.setSourceOrganization(aiData.sourceOrganization());
        policy.setTargetAgeMin(aiData.targetAgeMin());
        policy.setTargetAgeMax(aiData.targetAgeMax());
        policy.setTargetLocation(aiData.targetLocation());
        policy.setTargetJob(aiData.targetJob());
        policy.setTargetGender(aiData.targetGender());
        policy.setSupportStartDate(aiData.supportStartDate());
        policy.setSupportEndDate(aiData.supportEndDate());
        policy.setSourceUrl(request.sourceUrl());
        policy.setOriginalText(request.originalText());

        /**
         * AI가 반환한 날짜 문자열을 파싱합니다.
         * "YYYY-MM-DD" 같은 플레이스홀더거나, null이거나, 비어있으면 null을 반환합니다.
         */

        // 1. RDB에 먼저 저장
        Policy savedPolicy = policyRepository.save(policy);

        // 2. RDB 저장 성공 시, 벡터 DB에 임베딩
        try {
            vectorIngestionService.embedAndStore(savedPolicy);
        } catch (Exception e) {
            // TODO: 임베딩 실패 시 예외 처리 (예: 로그 남기기, 트랜잭션 롤백 등)
            // 여기서는 RuntimeException을 발생시켜 RDB 저장도 롤백시킵니다.
            throw new RuntimeException("벡터 DB 임베딩 실패: " + e.getMessage(), e);
        }

        return savedPolicy;
        //return policyRepository.save(policy);
    }
}