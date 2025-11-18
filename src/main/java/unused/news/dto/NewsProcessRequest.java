package unused.news.dto;

// 크롤러가 /api/process-news로 보낼 JSON의 구조
public record NewsProcessRequest(
        String originalText,  // 크롤링한 뉴스 원문
        String sourceUrl      // 크롤링한 뉴스 URL
) {}