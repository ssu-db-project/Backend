package com.ssu.DB_Project.crawl.service;

import com.ssu.DB_Project.crawl.sitecrawl.SiteCrawler;
import dev.langchain4j.agent.tool.P;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CrawlService {
    private final List<SiteCrawler> crawlers;
    public void runAllCrawls() {
        for (SiteCrawler crawler : crawlers) {
            long start = System.currentTimeMillis();
            System.out.println("▶ " + crawler.getSiteName() + " 작업 시작");

            try {
                crawler.crawl();
            } catch (Exception e) {
                System.err.println("❌ " + crawler.getSiteName() + " 실패: " + e.getMessage());
            }

            long end = System.currentTimeMillis();
            System.out.println( crawler.getSiteName() + " 종료 (소요시간: " + (end - start) + "ms)");
        }

        System.out.println(" [전체 크롤링] 모든 작업 완료!");
    }
}
