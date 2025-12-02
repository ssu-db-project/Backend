package com.ssu.DB_Project.search.service;

import com.ssu.DB_Project.search.dto.SearchResultDto;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public List<SearchResultDto> search(String query) {

        Embedding queryEmbedding = embeddingModel.embed(query).content();

        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(10)
                .build();

        var results = embeddingStore.search(request);

        return results.matches().stream()
                .map(match -> {

                    var metadata = match.embedded().metadata();

                    // 🔥 이제 무조건 String으로 반환
                    String id = null;
                    if (metadata.get("announcement_id") != null) {
                        id = metadata.get("announcement_id").toString();
                    } else if (metadata.get("program_id") != null) {
                        id = metadata.get("program_id").toString();
                    }

                    String title =
                            metadata.get("title") != null
                                    ? metadata.get("title").toString()
                                    : "제목 없음";

                    return SearchResultDto.builder()
                            .id(id)
                            .title(title)
                            .type(metadata.get("type").toString())
                            .sourceContent(match.embedded().text())
                            .similarity(match.score())
                            .build();
                })
                .toList();
    }
}
