package com.ssu.DB_Project.chatbot;

import com.ssu.DB_Project.policy.domain.Policy;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VectorIngestionService {

    // LangChainConfig에 등록된 Bean을 주입받습니다.
    private final EmbeddingStoreIngestor embeddingStoreIngestor;

    /**
     * Policy 엔티티를 받아 벡터 DB에 임베딩(저장)합니다.
     * PolicyService 내부에서 RDB 저장 직후 호출됩니다.
     *
     * @Transactional(propagation = Propagation.REQUIRES_NEW)
     * 위 어노테이션은 RDB 저장이 성공했을 때,
     * 이 임베딩 작업이 실패하더라도 RDB 저장을 롤백시키지 않기 위해
     * 별도의 트랜잭션으로 분리하는 옵션입니다. (지금은 필수는 아님)
     */
    public void embedAndStore(Policy policy) {
        log.info("정책 ID {}의 벡터 임베딩을 시작합니다...", policy.getId());

        try {
            // 1. 임베딩할 텍스트 생성 (원본 Python 코드 포맷과 동일하게)
            String embeddingText = formatPolicyForEmbedding(policy);

            // 2. LangChain4j Document 객체 생성
            Document document = Document.from(
                    embeddingText,
                    // ❗ 챗봇이 특정 정책을 필터링할 핵심 메타데이터
                    Metadata.from("policy_id", policy.getId().toString())
            );

            // 3. 벡터 DB에 저장 (Config의 Ingestor가 알아서 임베딩 후 저장)
            embeddingStoreIngestor.ingest(document);
            log.info("정책 ID {}의 벡터 임베딩 완료.", policy.getId());

        } catch (Exception e) {
            log.error("정책 ID {} 임베딩 중 오류 발생: {}", policy.getId(), e.getMessage(), e);
            // 여기서 예외를 다시 던져서 PolicyService의 RDB 저장까지 롤백시킬지,
            // 아니면 RDB 저장은 성공시키고 로그만 남길지 결정해야 합니다.
            // 여기서는 RDB 저장을 롤백시키기 위해 예외를 다시 던집니다.
            throw new RuntimeException("벡터 임베딩 실패", e);
        }
    }

    /**
     * Policy 엔티티의 필드들을 조합하여
     * AI가 검색하기 좋은 하나의 긴 텍스트(page_content)로 만듭니다.
     */
    private String formatPolicyForEmbedding(Policy policy) {
        // 원문(originalText)도 포함시켜야 검색 품질이 올라갑니다.
        return String.format(
                "정책 제목: %s\n\n세줄 요약: %s\n\n상세 설명: %s\n\n정책 원문: %s\n\n" +
                        "지원 대상: %d세부터 %d세까지, 거주 지역: %s, 직업: %s, 성별: %s\n" +
                        "신청 기간: %s 부터 %s 까지",
                policy.getTitle(),
                policy.getSummary3line() != null ? policy.getSummary3line() : "",
                policy.getDescription() != null ? policy.getDescription() : "",
                policy.getOriginalText() != null ? policy.getOriginalText() : "", // 원문 포함
                policy.getTargetAgeMin(),
                policy.getTargetAgeMax(),
                policy.getTargetLocation(),
                policy.getTargetJob(),
                policy.getTargetGender(),
                policy.getSupportStartDate(),
                policy.getSupportEndDate()
        );
    }
}