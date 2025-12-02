package com.ssu.DB_Project.chatbot;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.program.domain.Program;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

@Service
// @RequiredArgsConstructor
@Slf4j
public class VectorIngestionService {

    // @Autowired(required = false)
    // private final EmbeddingStoreIngestor embeddingStoreIngestor;
    private EmbeddingStoreIngestor embeddingStoreIngestor;

    @Autowired(required = false)
    public void setEmbeddingStoreIngestor(EmbeddingStoreIngestor embeddingStoreIngestor) {
        this.embeddingStoreIngestor = embeddingStoreIngestor;
    }

    public void embedAnnouncement(Announcement a) {
        if (embeddingStoreIngestor == null) {
            System.out.println("AI 모듈 비활성화 상태 : 임베딩을 건너뜁니다.");

            return ;
        }

        try {

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "announcement");
            metadata.put("announcement_id", a.getId());
            metadata.put("category_id", a.getCategory().getId());
            metadata.put("department_name", a.getDepartmentName());

            Document doc = Document.from(
                    formatAnnouncement(a),
                    Metadata.from(metadata)
            );

            embeddingStoreIngestor.ingest(doc);

        } catch (Exception e) {
            e.printStackTrace(); // 스택 트레이스 출력
            System.err.println("🔥 임베딩 상세 에러: " + e.getMessage());
            throw new RuntimeException("❌ 공지 임베딩 실패", e);
        }
    }

    public void embedProgram(Program p) {
        if (embeddingStoreIngestor == null) {
            System.out.println("AI 모듈 비활성화 상태 : 임베딩을 건너뜁니다.");
            return;
        }

        try {

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "program");
            metadata.put("program_id", p.getId());
            metadata.put("program_category_id", p.getCategory().getId());
            metadata.put("organization_name", p.getOrganizationName());

            Document doc = Document.from(
                    formatProgram(p),
                    Metadata.from(metadata)
            );

            embeddingStoreIngestor.ingest(doc);

        } catch (Exception e) {
            throw new RuntimeException("❌ 프로그램 임베딩 실패", e);
        }
    }

    private String formatAnnouncement(Announcement a) {
        return """
            [공지 제목] %s
            [요약] %s
            [내용] %s
            [카테고리] %s
            [부서] %s
            [게시일] %s
            [상태] %s
            """.formatted(
                nullSafe(a.getTitle()),
                nullSafe(a.getSummary()),
                nullSafe(a.getContent()),
                a.getCategory().getName(),
                a.getDepartmentName(),
                a.getPostedAt(),
                nullSafe(a.getStatus())
        );
    }

    private String formatProgram(Program p) {
        return """
            [프로그램 제목] %s
            [부제] %s
            [내용] %s
            [대상] %s
            [장소] %s
            [운영 방식] %s
            [신청 기간] %s ~ %s
            """.formatted(
                nullSafe(p.getTitle()),
                nullSafe(p.getSubtitle()),
                nullSafe(p.getContent()),
                nullSafe(p.getTargetAudience()),
                nullSafe(p.getLocation()),
                nullSafe(p.getOperationMethod()),
                p.getApplyStartAt(),
                p.getApplyEndAt()
        );
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }
}
