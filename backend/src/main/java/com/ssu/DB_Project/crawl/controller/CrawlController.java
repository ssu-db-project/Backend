package com.ssu.DB_Project.crawl.controller;

import com.ssu.DB_Project.crawl.service.CrawlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CrawlController {
    private final CrawlService crawlService;
    @PostMapping("/crawlingRun")
    public ResponseEntity<String> runManualCrawling() {
        crawlService.runAllCrawls();
        return ResponseEntity.ok("모든 크롤링 작업이 완료되었습니다.");
    }
}
