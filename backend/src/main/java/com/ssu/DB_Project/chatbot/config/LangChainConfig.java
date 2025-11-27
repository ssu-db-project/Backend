package com.ssu.DB_Project.chatbot.config;

import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
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
<<<<<<< HEAD:backend/src/main/java/com/ssu/DB_Project/chatbot/config/LangChainConfig.java
        // ❗ 반드시 builder() 방식 사용해야 함
        return ChromaEmbeddingStore.builder()
=======
            return ChromaEmbeddingStore.builder()
>>>>>>> ccb29fab (program_organization deleted):src/main/java/com/ssu/DB_Project/chatbot/config/LangChainConfig.java
                    .baseUrl(chromaBaseUrl)          // http://localhost:8000
                    .collectionName(chromaCollection) // univ_embeddings
                    .timeout(Duration.ofSeconds(30))
                    .build();
<<<<<<< HEAD:backend/src/main/java/com/ssu/DB_Project/chatbot/config/LangChainConfig.java
        //return new InMemoryEmbeddingStore<>();
=======
>>>>>>> ccb29fab (program_organization deleted):src/main/java/com/ssu/DB_Project/chatbot/config/LangChainConfig.java
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
