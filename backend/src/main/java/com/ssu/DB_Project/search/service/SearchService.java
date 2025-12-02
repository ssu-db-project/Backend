package com.ssu.DB_Project.search.service;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.program.domain.Program;
import com.ssu.DB_Project.program.repository.ProgramRepository;
import com.ssu.DB_Project.search.dto.SearchResultDto;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final AnnouncementRepository announcementRepository;
    private final ProgramRepository programRepository;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final OpenAiEmbeddingModel embeddingModel;

    public List<SearchResultDto> search(String query) {

        // 1. DB keyword filtering
        List<Announcement> ann = announcementRepository
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSummaryContainingIgnoreCase(
                        query, query, query);

        List<Program> prog = programRepository
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSubtitleContainingIgnoreCase(
                        query, query, query);

        // 2. Vector search
        Embedding emb = embeddingModel.embed(query).content();

        var req = EmbeddingSearchRequest.builder()
                .queryEmbedding(emb)
                .maxResults(10)
                .build();

        var vec = embeddingStore.search(req);

        // 3. convert
        List<SearchResultDto> results = new ArrayList<>();

        for (Announcement a : ann)
            results.add(SearchResultDto.fromAnnouncement(a, 0.95));

        for (Program p : prog)
            results.add(SearchResultDto.fromProgram(p, 0.95));

        vec.matches().forEach(m -> {
            Map<String,String> meta = m.embedded().metadata().asMap();
            String type = meta.get("type");

            if("announcement".equals(type)) {
                announcementRepository.findById(meta.get("announcement_id"))
                        .ifPresent(a -> results.add(SearchResultDto.fromAnnouncement(a, m.score())));
            }

            if("program".equals(type)) {
                programRepository.findById(meta.get("program_id"))
                        .ifPresent(p -> results.add(SearchResultDto.fromProgram(p, m.score())));
            }
        });

        // 4. dedupe
        Map<String,SearchResultDto> dedup = new HashMap<>();
        for (SearchResultDto r : results) {
            String key = r.getType() + "-" + r.getId();
            dedup.putIfAbsent(key, r);
        }

        return dedup.values().stream()
                .sorted(Comparator.comparingDouble(SearchResultDto::getSimilarity).reversed())
                .toList();
    }
}

