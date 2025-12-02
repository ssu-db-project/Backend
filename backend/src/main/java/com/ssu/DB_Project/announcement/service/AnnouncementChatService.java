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

// @Service
@RequiredArgsConstructor
public class AnnouncementChatService {

    private final ChatLanguageModel chatLanguageModel;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    /**
     * RAG 기반 공지 Q/A 서비스
     */
    public String ask(String userId, String question) {

        // 1) 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2) 사용자 관심 카테고리 목록
        List<String> categoryIds = user.getInterestCategories().stream()
                .map(uc -> uc.getCategory().getId())
                .toList();

        // 3) 메타데이터 필터 생성
        var filter = metadataKey("type").isEqualTo("announcement")
                .and(metadataKey("category_id").isIn(categoryIds));

        // 4) RAG - Retriever 구성
        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .filter(filter)
                .build();

        // 5) RAG - QA Chain 구성
        ConversationalRetrievalChain chain = ConversationalRetrievalChain.builder()
                .chatLanguageModel(chatLanguageModel)
                .contentRetriever(retriever)
                .build();

        // 6) LLM 실행
        return chain.execute(question);
    }
}
