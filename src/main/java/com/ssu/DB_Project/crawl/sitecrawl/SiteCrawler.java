package com.ssu.DB_Project.crawl.sitecrawl;

public interface SiteCrawler {
    // 크롤링 수행 메서드
    // 사이트 접속 -> 데이터 수집 -> gpt 모듈 호출해서 데이터 분석/가공 -> DB 저장
    void crawl();

    // 어떤 사이트를 담당하는지 알려주는 식별자
    String getSiteName();
}
