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

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final AnnouncementRepository announcementRepository;
    private final ProgramRepository programRepository;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;

    public SearchService(
            AnnouncementRepository announcementRepository,
            ProgramRepository programRepository,
            EmbeddingStore<TextSegment> embeddingStore,
            EmbeddingModel embeddingModel
    ) {
        this.announcementRepository = announcementRepository;
        this.programRepository = programRepository;
        this.embeddingStore = embeddingStore;
        this.embeddingModel = embeddingModel;
    }

    public List<SearchResultDto> search(String query) {

        /* =============================
         * 1) 키워드 기반 필터링 (RDB)
         * ============================= */
        List<Announcement> annCandidates =
                announcementRepository
                        .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSummaryContainingIgnoreCase(
                                query, query, query
                        );

        List<Program> progCandidates =
                programRepository
                        .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSubtitleContainingIgnoreCase(
                                query, query, query
                        );

        // 후보들의 ID set 저장 (벡터 필터링에 사용)
        Set<Long> annIds = annCandidates.stream()
                .map(Announcement::getId)
                .collect(Collectors.toSet());

        Set<String> progIds = progCandidates.stream()
                .map(Program::getId)
                .collect(Collectors.toSet());

        /* =============================
         * 2) 벡터 검색 (Vector Ranking)
         * ============================= */
        Embedding queryEmbedding = embeddingModel.embed(query).content();

        var request = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(20)   // 넉넉하게 가져와서 필터링 후 사용
                .build();

        var vectorMatches = embeddingStore.search(request);

        /* =============================
         * 3) 결과 누적 + 벡터 필터 반영
         * ============================= */
        List<SearchResultDto> results = new ArrayList<>();

        // RDB 기본 점수 0.95로 등록
        for (Announcement a : annCandidates) {
            results.add(SearchResultDto.fromAnnouncement(a, 0.95));
        }
        for (Program p : progCandidates) {
            results.add(SearchResultDto.fromProgram(p, 0.95));
        }

        // vector 결과 중 “RDB 후보만” 포함
        vectorMatches.matches().forEach(match -> {

            Map<String, String> meta = match.embedded().metadata().asMap();
            String type = meta.get("type");

            if ("announcement".equals(type)) {
                String id = meta.get("announcement_id");

                // RDB 후보에 포함된 것만 반영
                if (id != null && annIds.contains(Long.valueOf(id))) {
                    Announcement a = announcementRepository.findById(id).orElse(null);
                    if (a != null)
                        results.add(SearchResultDto.fromAnnouncement(a, match.score()));
                }
            }

            if ("program".equals(type)) {
                String id = meta.get("program_id");

                if (id != null && progIds.contains(id)) {
                    Program p = programRepository.findById(id).orElse(null);
                    if (p != null)
                        results.add(SearchResultDto.fromProgram(p, match.score()));
                }
            }
        });

        /* =============================
         * 4) 최종 정렬 후 반환
         * ============================= */
        return results.stream()
                .sorted(Comparator.comparingDouble(SearchResultDto::getSimilarity).reversed())
                .collect(Collectors.toList());
    }
}
