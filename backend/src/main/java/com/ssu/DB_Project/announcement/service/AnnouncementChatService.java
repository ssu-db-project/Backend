package com.ssu.DB_Project.announcement.service;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.user.domain.User;
import com.ssu.DB_Project.user.repository.UserRepository;
import dev.langchain4j.chain.ConversationalRetrievalChain;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;

@Service
@RequiredArgsConstructor
public class AnnouncementChatService {

    private final ChatLanguageModel chatLanguageModel;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    /**
     * RAG 기반 공지 Q/A 서비스 (관심 분야 interestField 기반)
     */
    public String ask(String userId, String question) {

        // 1) 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2) 사용자 관심 "분야" (InterestField) 목록
        List<String> interestFields = user.getInterestFields().stream()
                .map(uif -> uif.getField().getName())   // 예: "AI", "반도체", "창업" 등
                .toList();

        // 3) 메타데이터 필터: 공지(type=announcement)만 검색
        var filter = metadataKey("type").isEqualTo("announcement");

        // 4) Retriever 구성
        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .filter(filter)
                .build();

        // 5) 사용자 정보를 포함한 확장 질문
        String enrichedQuestion = """
                당신은 숭실대학교 학생에게 공지사항을 추천/설명하는 AI 어시스턴트입니다.

                사용자 정보:
                - 이름: %s
                - 성별: %s
                - 전공: %s
                - 학년: %d
                - 관심 분야: %s

                위 사용자의 관심 분야와 학년, 전공을 고려해서
                아래 질문에 가장 잘 맞는 공지사항을 중심으로 친절히 설명해 주세요.

                질문: %s
                """.formatted(
                user.getName(),
                user.getGender(),
                user.getDepartment() != null ? user.getDepartment().getName() : "없음",
                user.getGrade() != null ? user.getGrade() : 0,
                interestFields,
                question
        );

        // 6) QA Chain 실행
        ConversationalRetrievalChain chain = ConversationalRetrievalChain.builder()
                .chatLanguageModel(chatLanguageModel)
                .contentRetriever(retriever)
                .build();

        return chain.execute(enrichedQuestion);
    }
}