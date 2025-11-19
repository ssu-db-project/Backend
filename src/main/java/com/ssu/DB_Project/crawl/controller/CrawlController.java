package com.ssu.DB_Project.crawl.controller;

import unused.news.dto.NewsProcessRequest;
import unused.policy.dto.PolicyProcessRequest;
import unused.news.domain.News;
import unused.policy.domain.Policy;
import unused.news.service.NewsService;
import unused.policy.service.PolicyService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CrawlController {
    /*
    private final PolicyService policyService;
    private final NewsService newsService;

    public CrawlController(PolicyService policyService, NewsService newsService) {
        this.policyService = policyService;
        this.newsService = newsService;
    }

    /**
     * 크롤링된 정책 원문을 받아 AI로 정제하고 DB에 저장합니다.

    @PostMapping("/process-policy")
    public Policy processPolicy(@RequestBody PolicyProcessRequest request) {
        System.out.println("📥 Received Policy Request: " + request);
        return policyService.processAndSave(request);
    }

    @PostMapping("/process-news")
    public News processNews(@RequestBody NewsProcessRequest request) {
        // 3. NewsService의 정제/저장 로직 호출
        return newsService.processAndSave(request);
    }
    */

    // (추가로 /process-news 엔드포인트도 동일한 패턴으로 만들 수 있습니다.)
}