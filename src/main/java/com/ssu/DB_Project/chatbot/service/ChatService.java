package com.ssu.DB_Project.chatbot.service;

import dev.langchain4j.chain.ConversationalRetrievalChain;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatLanguageModel chatLanguageModel;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public String askPolicy(Long policyId, String question) {

        // 1. Python의 'retriever' 생성 (policy_id로 필터링)
        // search_kwargs={"filter": {"policy_id": policy_id}, "k": 3} 와 동일
        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(3) // k=3
                .filter(metadataKey("policy_id").isEqualTo(policyId.toString())) // ❗ 핵심 필터
                .build();

        // 2. Python의 'RetrievalQA' 체인 생성
        ConversationalRetrievalChain chain = ConversationalRetrievalChain.builder()
                .chatLanguageModel(chatLanguageModel)
                .contentRetriever(retriever)
                // .chatMemory() // (필요시 대화 메모리 추가)
                .build();

        // 3. 체인 실행 및 답변 반환
        return chain.execute(question);
    }
}
