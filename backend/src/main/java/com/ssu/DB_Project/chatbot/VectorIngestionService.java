package com.ssu.DB_Project.chatbot;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.program.domain.Program;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class VectorIngestionService {

    private final EmbeddingStoreIngestor ingestor;
    private final EmbeddingStore<?> embeddingStore;

    @Value("${langchain.chroma.base-url}")
    private String chromaHost;

    @Value("${langchain.chroma.collection-name}")
    private String chromaCollection;


    /** ---------------------------
     *  🔍 Chroma Metadata 중복 검색
     * --------------------------- */
    private boolean existsInChroma(String url) {
        try {
            RestTemplate rest = new RestTemplate();

            String endpoint = chromaHost + "/api/v1/collections/" + chromaCollection + "/query";

            Map<String, Object> body = new HashMap<>();
            body.put("query_texts", new String[]{""});
            body.put("where", Map.of("url", url));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    rest.exchange(endpoint, HttpMethod.POST, request, String.class);

            return response.getBody() != null && response.getBody().contains("ids");
        } catch (Exception e) {
            log.error("❌ Chroma 중복 검색 실패", e);
            return false;
        }
    }


    /** ---------------------------
     *  공지 임베딩 (중복 방지)
     * --------------------------- */
    public void embedAnnouncement(Announcement a) {
        try {
            String url = a.getUrl();

            if (existsInChroma(url)) {
                log.info("⚠ 이미 존재하는 공지 → 임베딩 생략: {}", url);
                return;
            }

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "announcement");
            metadata.put("url", url);
            metadata.put("title", a.getTitle());
            metadata.put("announcement_id", a.getId());

            Document doc = Document.from(
                    formatAnnouncement(a),
                    Metadata.from(metadata)
            );

            ingestor.ingest(doc);
            log.info("✅ 공지 저장 완료: {}", url);

        } catch (Exception e) {
            throw new RuntimeException("❌ 공지 임베딩 실패", e);
        }
    }

    /** ---------------------------
     *  프로그램 임베딩 (중복 방지)
     * --------------------------- */
    public void embedProgram(Program p) {
        try {
            String url = p.getOriginalUrl();

            if (existsInChroma(url)) {
                log.info("⚠ 이미 존재하는 프로그램 → 임베딩 생략: {}", url);
                return;
            }

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "program");
            metadata.put("url", url);
            metadata.put("title", p.getTitle());
            metadata.put("program_id", p.getId());

            Document doc = Document.from(
                    formatProgram(p),
                    Metadata.from(metadata)
            );

            ingestor.ingest(doc);
            log.info("✅ 프로그램 저장 완료: {}", url);

        } catch (Exception e) {
            throw new RuntimeException("❌ 프로그램 임베딩 실패", e);
        }
    }

    // 포맷 메서드는 동일
    private String formatAnnouncement(Announcement a) {
        return "[공지] " + a.getTitle() + "\n" + a.getContent();
    }

    private String formatProgram(Program p) {
        return "[프로그램] " + p.getTitle() + "\n" + p.getContent();
    }
}
