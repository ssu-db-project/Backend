package com.ssu.DB_Project.policy.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ssu.DB_Project.policy.domain.Policy;
import com.ssu.DB_Project.policy.dto.PolicyProcessRequest;
import com.ssu.DB_Project.policy.dto.ProcessedPolicy;
import com.ssu.DB_Project.policy.repository.PolicyRepository;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final OpenAiChatModel openAiModel;
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public PolicyService(
            PolicyRepository policyRepository,
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.model}") String model,
            @Value("${openai.temperature}") double temperature
    ) {
        this.policyRepository = policyRepository;
        this.openAiModel = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName(model)
                .temperature(temperature)
                .build();
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
              "supportStartDate": "YYYY-MM-DD",
              "supportEndDate": "YYYY-MM-DD"
            }

            설명이나 여분의 텍스트 없이, 반드시 위 JSON 구조만 출력하세요.
            """;

        String prompt = systemPrompt + "\n\n정책 원문:\n" + request.originalText();

        // LLM 호출
        String rawResponse = openAiModel.generate(UserMessage.from(prompt))
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

        return policyRepository.save(policy);
    }
}