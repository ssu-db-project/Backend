package com.ssu.DB_Project.crawl.sitecrawl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willAnswer;

import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.announcement.service.AnnouncementService;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
class SsuAnnouncementTest {

    // 테스트할 페이지 수
    private static final int TEST_PAGE_COUNT = 2;
    private static final String BASE_URL = "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/";

    @Test
    @DisplayName("목록 크롤링 테스트 (카테고리 포함)")
    void pageLoopTest() {
        // 1. 브라우저 설정
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless"); // 화면 보고 싶으면 주석 유지
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        WebDriver driver = new ChromeDriver(options);

        try {
            System.out.println("🏁 [테스트 시작] 1 ~ " + TEST_PAGE_COUNT + "페이지 목록 확인");

            for (int page = 1; page <= TEST_PAGE_COUNT; page++) {

                String currentUrl = (page == 1) ? BASE_URL : BASE_URL + "page/" + page + "/";
                System.out.println("\n🌍 이동: " + currentUrl);

                driver.get(currentUrl);
                driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));

                List<WebElement> rows = driver.findElements(By.cssSelector("ul.notice-lists > li:not(.notice.head)"));

                if (rows.isEmpty()) {
                    System.out.println("⚠️ 목록 없음 (종료)");
                    break;
                }

                System.out.println("발견된 글: " + rows.size() + "개\n");

                for (WebElement row : rows) {
                    try {
                        // 1. 링크 확인 (빈 줄 무시)
                        List<WebElement> linkTags = row.findElements(By.cssSelector(".notice_col3 a"));
                        if (linkTags.isEmpty()) continue;

                        WebElement linkTag = linkTags.get(0);

                        // 2. 날짜 (숨겨진 요소 대응)
                        String date = "";
                        try {
                            date = row.findElement(By.cssSelector(".notice_col1")).getAttribute("innerText").trim();
                        } catch (Exception e) { date = "날짜미상"; }

                        // 3. 상태 (진행/마감)
                        String status = "일반";
                        try {
                            status = row.findElement(By.cssSelector(".notice_col2 .tag")).getText();
                        } catch (Exception ignored) {}

                        // 4. 부서
                        String dept = "숭실대";
                        try {
                            dept = row.findElement(By.cssSelector(".notice_col4")).getText();
                        } catch (Exception ignored) {}

                        // ============================================================
                        // 💡 5. [NEW] 카테고리 확인 (국제교류, 학사 등)
                        // ============================================================
                        String category = "일반공지";
                        try {
                            // .notice_col3 안에 있는 .label 클래스 텍스트 추출
                            category = row.findElement(By.cssSelector(".notice_col3 .label")).getText().trim();
                        } catch (Exception ignored) {
                            // 라벨 없으면 기본값 유지
                        }

                        // 6. 제목 정리
                        String title = linkTag.getText().trim();
                        if (title.isEmpty()) {
                            title = linkTag.getAttribute("innerText").trim();
                        }
                        title = title.replace("\n", " ").replaceAll("\\s+", " ");

                        // 콘솔 출력 (카테고리 포함)
                        System.out.printf("[%s] [%s] %s | %s | %s\n", date, category, status, dept, title);

                    } catch (Exception e) {
                        System.out.println("❌ 파싱 에러: " + e.getMessage());
                    }
                }
                Thread.sleep(1000);
            }



        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) driver.quit();
            System.out.println("\n🏁 테스트 종료");
        }
    }
    @Test
    @DisplayName("상세페이지 본문 및 첨부파일 파싱 테스트")
    void contentAndAttachmentTest() {
        // 1. 브라우저 설정
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless"); // 눈으로 보려면 주석 처리 유지
        options.addArguments("--no-sandbox");
        options.addArguments("--remote-allow-origins=*");
        WebDriver driver = new ChromeDriver(options);

        try {
            System.out.println("🏁 [테스트 시작] 상위 3개 게시글의 본문과 파일을 확인합니다.");

            // 공지사항 목록 접근
            driver.get(BASE_URL);
            Thread.sleep(1000);

            // 게시글 링크들 가져오기
            List<WebElement> articles = driver.findElements(By.cssSelector(".notice_col3 a"));
            int checkCount = Math.min(articles.size(), 3); // 상위 3개만 체크

            for (int i = 0; i < checkCount; i++) {
                // StaleElement 방지 (매번 다시 찾기)
                WebElement link = driver.findElements(By.cssSelector(".notice_col3 a")).get(i);
                String title = link.getText().trim();
                String url = link.getAttribute("href");

                System.out.println("\n==============================================================");
                System.out.println("TARGET [" + (i+1) + "]: " + title);
                System.out.println("URL: " + url);
                System.out.println("==============================================================");

                // 상세 페이지 이동
                driver.get(url);
                Thread.sleep(800);

                // -------------------------------------------------------
                // 1️⃣ 본문 크롤링 테스트
                // -------------------------------------------------------
                String contentBody = "";
                try {
                    // 1순위
                    contentBody = driver.findElement(By.cssSelector("div.bg-white.p-4.mb-5")).getText();
                    System.out.println("✅ [성공] 본문 Selector (1순위: .bg-white.p-4.mb-5) 로 찾음");
                } catch (Exception e) {
                    try {
                        // 2순위
                        contentBody = driver.findElement(By.cssSelector(".bg-white.p-4")).getText();
                        System.out.println("✅ [성공] 본문 Selector (2순위: .bg-white.p-4) 로 찾음");
                    } catch (Exception e2) {
                        // 3순위
                        contentBody = driver.findElement(By.tagName("body")).getText();
                        System.out.println("⚠️ [주의] 본문 Selector 실패 -> Body 전체 가져옴");
                    }
                }

                // 본문 출력 (너무 길면 자르기)
                System.out.println("\n📜 [본문 내용 미리보기 (최대 300자)]");
                System.out.println("--------------------------------------------------------------");
                if (contentBody.length() > 300) {
                    System.out.println(contentBody.substring(0, 300) + "\n... (중략) ...");
                } else {
                    System.out.println(contentBody);
                }
                System.out.println("--------------------------------------------------------------");


                // -------------------------------------------------------
                // 2️⃣ 첨부파일 크롤링 테스트
                // -------------------------------------------------------
                List<String> aiFileStrings = new ArrayList<>();
                try {
                    List<WebElement> downloadLinks = driver.findElements(By.cssSelector("ul.download-list li a"));

                    System.out.println("\n📎 [첨부파일 목록]");
                    if (downloadLinks.isEmpty()) {
                        System.out.println("   (첨부파일 없음)");
                    } else {
                        for (WebElement dLink : downloadLinks) {
                            String fileUrl = dLink.getAttribute("href");
                            String fileName = "";
                            try {
                                fileName = dLink.findElement(By.tagName("span")).getText().trim();
                            } catch (Exception e) {
                                fileName = dLink.getText().trim();
                            }

                            // 결과 출력
                            System.out.println("   📄 " + fileName + " -> " + fileUrl);
                            aiFileStrings.add("[" + fileName + "](" + fileUrl + ")");
                        }
                    }
                } catch (Exception e) {
                    System.out.println("   ⚠️ 첨부파일 파싱 중 에러");
                }

                // AI 텍스트 변환 결과 확인
                String attachmentText = aiFileStrings.isEmpty() ? "없음" : String.join("\n", aiFileStrings);
                System.out.println("\n🤖 [AI에게 전달될 첨부파일 텍스트]\n" + attachmentText);

                // 목록으로 돌아가기 위해 다시 get (back보다 안전)
                driver.get(BASE_URL);
                Thread.sleep(800);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) driver.quit();
            System.out.println("\n🏁 테스트 종료");
        }
    }

}