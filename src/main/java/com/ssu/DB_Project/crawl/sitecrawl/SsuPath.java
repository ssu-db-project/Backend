package com.ssu.DB_Project.crawl.sitecrawl;

import org.springframework.stereotype.Component;

@Component
public class SsuPath implements SiteCrawler {

    // DB 저장용
    //@Autowired
    //private PolicyRepository policyRepository;

    // GPT 모듈 주입

    // 크롤링할 사이트
    private static final String url = "https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch";

    // 사이트 크롤링
    // 프로세스는 사이트 접속 -> 데이터 수집 -> gpt 모듈 호출해서 데이터 분석/가공 -> DB 저장
    @Override
    public void crawl() {

    }

    // 크롤링 사이트명 제출
    @Override
    public String getSiteName() {
        return "슈패스";
    }

}
