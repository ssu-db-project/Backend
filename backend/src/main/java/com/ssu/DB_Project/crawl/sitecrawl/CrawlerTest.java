package com.ssu.DB_Project.crawl.sitecrawl;

import com.ssu.DB_Project.crawl.sitecrawl.SsuPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CrawlerTest implements CommandLineRunner {

    @Autowired
    private SsuPath ssuPath; // 우리가 만든 크롤러 주입
    @Autowired
    private SsuAnnouncement ssuAnnouncement;


    @Override
    public void run(String... args) throws Exception {

        System.out.println("=========== [TEST] 크롤링 테스트 시작 ===========");

        // 여기서 크롤링 메서드 강제 실행
        ssuPath.crawl();
        ssuAnnouncement.crawl();
        System.out.println("=========== [TEST] 크롤링 테스트 종료 ===========");


    }
}