package unused.news.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import unused.news.domain.News;
import unused.news.dto.NewsProcessRequest;
import unused.news.dto.ProcessedNews;
import unused.news.repository.NewsRepository;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final OpenAiChatModel openAiModel;
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public NewsService(
            NewsRepository newsRepository,
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.model}") String model,
            @Value("${openai.temperature}") double temperature
    ) {
        this.newsRepository = newsRepository;
        this.openAiModel = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName(model)
                .temperature(temperature)
                .build();
    }

    @Transactional
    public News processAndSave(NewsProcessRequest request) {
        // 프롬프트 작성
        String systemPrompt = """
            당신은 뉴스 기사를 분석하는 전문 AI 에디터입니다.
            아래 원문을 분석하여 다음 JSON 구조에 맞는 결과만 출력하세요.
            설명하지 말고 반드시 JSON만 출력하세요.

            {
              "title": "...",
              "summary": "...",
              "description": "...",
              "publishedAt": "YYYY-MM-DDTHH:MM:SS",
              "sourceName": "..."
            }
            """;

        String prompt = systemPrompt + "\n\n뉴스 원문:\n" + request.originalText();

        // LangChain4j로 OpenAI 호출
        String rawResponse = openAiModel.generate(UserMessage.from(prompt))
                .content()
                .text();

        System.out.println("✅ Raw AI response:\n" + rawResponse);

        // JSON 파싱
        ProcessedNews aiData;
        try {
            aiData = mapper.readValue(rawResponse, ProcessedNews.class);
        } catch (Exception e) {
            throw new RuntimeException("❌ LLM JSON 파싱 실패: " + e.getMessage() + "\n응답 내용: " + rawResponse);
        }

        // Entity 생성 및 저장
        News news = new News();
        news.setSourceUrl(request.sourceUrl());
        news.setTitle(aiData.title());
        news.setSummary(aiData.summary());
        news.setDescription(aiData.description());
        news.setPublishedAt(aiData.publishedAt());
        news.setSourceName(aiData.sourceName());

        return newsRepository.save(news);
    }
}