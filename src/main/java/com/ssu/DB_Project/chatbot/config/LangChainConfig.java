package com.ssu.DB_Project.chatbot.config;

import java.time.Duration;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LangChainConfig {

    @Value("${openai.api-key}") private String openaiApiKey;
    @Value("${openai.model}") private String openaiModel;
    @Value("${openai.temperature}") private double openaiTemperature;

    // ▼ 새로 추가
    @Value("${langchain.chroma.base-url}") private String chromaBaseUrl;
    @Value("${langchain.chroma.collection-name}") private String chromaCollection;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName(openaiModel)
                .temperature(openaiTemperature)
                .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return OpenAiEmbeddingModel.builder()
                .apiKey(openaiApiKey)
                .build();
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        // ✅ 서버 모드로 Chroma 연결 (권장)
        return ChromaEmbeddingStore.builder()
                .baseUrl(chromaBaseUrl)              // 예: http://localhost:8000
                .collectionName(chromaCollection)    // 예: policy_embeddings
                .timeout(Duration.ofSeconds(30))     // 선택
                .build();
    }

    @Bean
    public EmbeddingStoreIngestor embeddingStoreIngestor(
            EmbeddingStore<TextSegment> embeddingStore,
            EmbeddingModel embeddingModel
    ) {
        return EmbeddingStoreIngestor.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .build();
    }
}
